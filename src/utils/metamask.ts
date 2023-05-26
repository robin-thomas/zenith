import { providers, Contract, utils } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import dayjs from 'dayjs';

import AppContract from '../../solidity/artifacts/contracts/Zenith.sol/Zenith.json';
import type { IPay } from './metamask.types';
import { APP_NAME_CAPS } from '@/constants/app';
import { TABLE_CLICK } from '@/constants/sxt';

const getContract = () => {
  const provider = new providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  return new Contract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string,
    AppContract.abi,
    signer
  );
};

export const login = async () => {
  const provider = await detectEthereumProvider({ silent: true });

  if (provider) {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

    if (accounts?.length > 0) {
      window.sessionStorage.removeItem('zenith.user.logout');
    }

    return accounts;
  }
};

export const pay = async ({ budget, costPerClick, name, url, description, endDate }: IPay) => {
  const resp = await fetch('/api/campaign', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      description,
      url,
    }),
  });
  const { id } = await resp.json();

  const contract = getContract();

  return await contract.createCampaign(
    utils.parseEther(budget.toString()),
    utils.parseEther(costPerClick.toString()),
    endDate,
    id,
    {
      value: utils.parseEther(budget.toString()),
    }
  );
};

const toCampaign = (campaign: any) => ({
  id: campaign.id.toString(),
  advertiser: campaign.advertiser,
  budget: utils.formatEther(campaign.budget),
  remaining: utils.formatEther(campaign.remaining),
  costPerClick: utils.formatEther(campaign.minCostPerClick),
  active: campaign.active,
  cid: campaign.cid,
  clicks: [],
  endDatetime: dayjs.unix(campaign.endDatetime.toNumber()).format('MMM D, YYYY hh:mm A'),
});

export const getCampaigns = async () => {
  const contract = getContract();
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
  const contract = getContract();

  if (status === 'pause') {
    return await contract.disableCampaign(campaignId);
  }
  return await contract.enableCampaign(campaignId);
};

export const getAvailableAds = async (address: string) => {
  const contract = getContract();
  const ads = await contract.getAvailableCampaigns();

  let campaigns = ads.map(toCampaign);

  const resp = await fetch(`/api/click?user=${address}`);
  if (resp.ok) {
    const clicks = await resp.json();
    const campaignIds = clicks.map(({ campaignId }: any) => campaignId.toString());

    campaigns = campaigns
      .filter(({ id }: { id: number }) => !campaignIds.includes(id));
  }

  const campaignDetails = await getCampaignDetails(campaigns.map(({ cid }: any) => cid));

  return campaigns.map((campaign: any) => ({
    ...campaign,
    ...campaignDetails[campaign.cid],
  }));
};

export const getSignatureForAdClick = async (campaignId: string, displayTime: number) => {
  const provider = new providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const message = utils.solidityPack(['uint256', 'uint256'], [Number.parseInt(campaignId), displayTime]);
  const hash = utils.solidityKeccak256(['bytes'], [message]);
  return await signer.signMessage(utils.arrayify(hash));
};

export const requestRewards = async () => {
  const contract = getContract();

  return await contract.triggerRetrieveRewards(
    `${APP_NAME_CAPS}.${TABLE_CLICK}`,
    {
      gasLimit: 1000000,
    }
  );
};

export const getLastProcessed = async () => {
  const contract = getContract();
  const lastProcessed = await contract.getLastProcessed();

  return lastProcessed.toNumber();
};

export const getRewardDetails = async () => {
  const contract = getContract();
  const details = await contract.getRewardsOfUser();

  return {
    reward: utils.formatEther(details.reward),
    adClicks: details.adClicks.toNumber(),
  };
};

const getCampaignDetails = async (campaignIds: string[]) => {
  const resp = await fetch(`/api/campaign?ids=${campaignIds.join(',')}`);
  const json = await resp.json();

  return json.reduce((acc: any, { id, name, description, url, created }: any) => ({
    ...acc,
    [id]: {
      name,
      description,
      url,
      startDatetime: created ? dayjs(created).format('MMM D, YYYY hh:mm A') : null,
    }
  }), {});
};
