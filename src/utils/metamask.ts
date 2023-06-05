import { Contract, BrowserProvider, parseEther, formatEther, solidityPackedKeccak256, getBytes } from 'ethers';
import dayjs from 'dayjs';

import AppContract from '../../solidity/artifacts/contracts/Zenith.sol/Zenith.json';
import type { IPay } from './metamask.types';
import { APP_HOST, APP_NAME_CAPS, CHAIN_ID } from '@/constants/app';
import { TABLE_CLICK } from '@/constants/sxt';

const getContract = async () => {
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return new Contract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string,
    AppContract.abi,
    signer
  );
};

export const login = async (): Promise<string[] | undefined> => {
  const provider = new BrowserProvider(window.ethereum);

  if (provider) {
    const accounts = await provider.send('eth_requestAccounts', []);

    const chainId = await provider.send('eth_chainId', []);
    if (chainId === CHAIN_ID) {
      if (accounts?.length > 0) {
        window.sessionStorage.removeItem('zenith.user.logout');
      }

      return accounts;
    } else {
      await provider.send('wallet_switchEthereumChain', [{ chainId: CHAIN_ID }]);
      return login();
    }
  }
};

export const pay = async ({ budget, costPerClick, name, url, targeting, description, endDate }: IPay) => {
  const resp = await fetch(`${APP_HOST}/api/campaign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      description,
      url,
      targeting,
    }),
  });
  const { id } = await resp.json();

  const contract = await getContract();

  return await contract.createCampaign(
    parseEther(budget.toString()),
    parseEther(costPerClick.toString()),
    endDate,
    id,
    {
      value: parseEther(budget.toString()),
    }
  );
};

const toCampaign = (campaign: any) => ({
  id: campaign.id.toString(),
  advertiser: campaign.advertiser,
  budget: formatEther(campaign.budget),
  remaining: Number.parseFloat(formatEther(campaign.remaining)),
  costPerClick: Number.parseFloat(formatEther(campaign.baseCostPerClick)),
  active: campaign.active,
  cid: campaign.cid,
  clicks: [],
  endDatetime: dayjs.unix(Number(campaign.endDatetime)).format('MMM D, YYYY hh:mm A'),
});

export const getCampaigns = async () => {
  const contract = await getContract();
  const campaigns = (await contract.getCampaignsOfAdvertiser())
    .map(({ campaign, adClicks }: any) => ({
      ...toCampaign(campaign),
      clicks: adClicks,
    }));

  const campaignIds = campaigns.map(({ cid }: any) => cid);
  const campaignDetails = await getCampaignDetails(campaignIds);

  return campaigns.map((campaign: any) => ({
    ...campaign,
    ...campaignDetails[campaign.cid],
  }));
};

export const toggleCampaignStatus = async (campaignId: string, status: 'pause' | 'start') => {
  const contract = await getContract();

  if (status === 'pause') {
    return await contract.disableCampaign(campaignId);
  }
  return await contract.enableCampaign(campaignId);
};

export const getAnAd = async (address: string, init?: RequestInit) => {
  const contract = await getContract();
  const ads = await contract.getAvailableCampaigns();
  if (ads.length === 0) {
    return;
  }

  let campaigns = ads.map(toCampaign);

  const resp = await fetch(`${APP_HOST}/api/click?user=${address}`, init);
  if (resp.ok) {
    const clicks = await resp.json();
    const campaignIds = clicks.map(({ campaignId }: any) => campaignId.toString());

    campaigns = campaigns
      .filter(({ id }: { id: number }) => !campaignIds.includes(id));
  }

  const campaignDetails = await getCampaignDetails(campaigns.map(({ cid }: any) => cid), init);

  const accountResp = await fetch(`${APP_HOST}/api/account?address=${address}`, init);
  if (accountResp.ok) {
    const account = await accountResp.json();

    campaigns = campaigns
      .filter(({ cid }: any) => {
        const { targeting } = campaignDetails[cid];

        if (targeting.enabled.nft) {
          if (account.ownedNFT === false) {
            return false;
          }
        }

        if (targeting.enabled.maticBalance) {
          if (account.balance < Number.parseFloat(targeting.maticBalance)) {
            return false;
          }
        }

        if (targeting.enabled.transactionCount) {
          if (account.txnCount < Number.parseInt(targeting.transactionCount)) {
            return false;
          }
        }

        if (targeting.enabled.walletAge) {
          if (account.walletAge < Number.parseInt(targeting.walletAge)) {
            return false;
          }
        }

        return true;
      });
  }

  const advertisers = campaigns.map(({ advertiser }: any) => advertiser);
  const reputation = await getReputation(advertisers);

  const campaignsWithDetails = campaigns
    .map((campaign: any) => ({
      ...campaign,
      ...campaignDetails[campaign.cid],
    }))
    .sort((a: any, b: any) => {
      const weightedSumA = a.costPerClick * 0.7 + (reputation[a.advertiser] ?? 0) * 0.2 + a.remaining * 0.1;
      const weightedSumB = b.costPerClick * 0.7 + (reputation[b.advertiser] ?? 0) * 0.2 + b.remaining * 0.1;

      return weightedSumB - weightedSumA;
    })
    ;

  return campaignsWithDetails?.[0];
};

export const getSignatureForAdClick = async (campaignId: string, displayTime: number) => {
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const hash = solidityPackedKeccak256(['uint256', 'uint256'], [Number.parseInt(campaignId), displayTime]);
  return await signer.signMessage(getBytes(hash));
};

export const requestRewards = async () => {
  const contract = await getContract();

  return await contract.triggerRetrieveRewards(
    `${APP_NAME_CAPS}.${TABLE_CLICK}`,
    {
      gasLimit: 1000000,
    }
  );
};

export const getLastProcessed = async () => {
  const contract = await getContract();
  const lastProcessed = await contract.getLastProcessed();

  return Number(lastProcessed);
};

export const getRewardDetails = async () => {
  const contract = await getContract();
  const details = await contract.getRewardsOfUser();

  return {
    reward: formatEther(details.reward),
    adClicks: Number(details.adClicks),
  };
};

const getReputation = async (advertisers: string[], init?: RequestInit) => {
  const reputation = {} as any;

  for (const advertiser of advertisers) {
    try {
      const resp = await fetch(`${APP_HOST}/api/passport/score/${advertiser}`, init);
      const { score } = await resp.json();

      reputation[advertiser] = score;
    } catch (err) { }
  }

  return reputation;
};

const getCampaignDetails = async (campaignIds: string[], init?: RequestInit) => {
  if (campaignIds.length === 0) {
    return {};
  }

  const resp = await fetch(`${APP_HOST}/api/campaign?ids=${campaignIds.join(',')}`, init);
  const json = await resp.json();

  return json.reduce((acc: any, { id, name, description, url, targeting, created }: any) => ({
    ...acc,
    [id]: {
      name,
      description,
      url,
      targeting,
      startDatetime: created ? dayjs(created).format('MMM D, YYYY hh:mm A') : null,
    }
  }), {});
};
