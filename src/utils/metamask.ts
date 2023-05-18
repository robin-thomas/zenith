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

export const pay = async ({ budget, costPerClick, name, url, endDate }: IPay) => {
  const contract = getContract();

  await contract.createCampaign(
    utils.parseEther(budget.toString()),
    utils.parseEther(costPerClick.toString()),
    endDate,
    name,
    url,
    url,
    {
      value: utils.parseEther(budget.toString()),
    }
  );
};

export const getCampaigns = async () => {
  const contract = getContract();

  const campaigns = await contract.getCampaignsOfAdvertiser();

  return campaigns.map((campaign: any) => ({
    budget: utils.formatEther(campaign.budget),
    remaining: utils.formatEther(campaign.remaining),
    costPerClick: utils.formatEther(campaign.minCostPerClick),
    name: campaign.name,
    url: campaign.adURL,
    active: campaign.active,
    startDatetime: dayjs.unix(campaign.startDatetime.toNumber()).format('MMM D, YYYY hh:mm:ss A'),
    endDatetime: dayjs.unix(campaign.endDatetime.toNumber()).format('MMM D, YYYY hh:mm:ss A'),
  }));
};
