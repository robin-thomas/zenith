import { providers, Contract, utils } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import dayjs from 'dayjs';

import AppContract from '../../solidity/artifacts/contracts/Zenith.sol/Zenith.json';
import type { IPay } from './metamask.types';

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
  const { cid } = await resp.json();

  const contract = getContract();

  return await contract.createCampaign(
    utils.parseEther(budget.toString()),
    utils.parseEther(costPerClick.toString()),
    endDate,
    cid,
    {
      value: utils.parseEther(budget.toString()),
    }
  );
};

const toCampaign = (campaign: any) => ({
  id: campaign.id.toString(),
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
  const campaigns = await contract.getCampaignsOfAdvertiser();

  return Promise.all(
    campaigns
      .map(({ campaign }: any) => toCampaign(campaign))
      .map(getCampaignDetails)
  );
};

export const toggleCampaignStatus = async (campaignId: string, status: 'pause' | 'start') => {
  const contract = getContract();

  if (status === 'pause') {
    return await contract.disableCampaign(campaignId);
  }
  return await contract.enableCampaign(campaignId);
};

export const getAvailableAds = async () => {
  const contract = getContract();
  const ads = await contract.getAvailableCampaigns();

  return Promise.all(
    ads.map(toCampaign).map(getCampaignDetails)
  );
};

export const getSignatureForAdClick = async (campaignId: string, displayTime: number) => {
  const provider = new providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const message = utils.solidityPack(['uint256', 'uint256'], [campaignId, displayTime]);
  const hash = utils.solidityKeccak256(['bytes'], [message]);
  return await signer.signMessage(utils.arrayify(hash));
};

const getCampaignDetails = async (campaign: any) => {
  const _url = process.env.NEXT_PUBLIC_IPFS_GATEWAY?.replace('{cid}', campaign.cid) as string;
  const resp = await fetch(_url);
  const { name, description, url, created } = await resp.json();

  return {
    ...campaign,
    name,
    description,
    url,
    startDatetime: dayjs(created).format('MMM D, YYYY hh:mm A'),
  };
};
