import { providers, Contract, utils } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';

import AppContract from '../../artifacts/contracts/Zenith.sol/Zenith.json';
import type { IPay } from './metamask.types';

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
  const provider = new providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const contract = new Contract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string,
    AppContract.abi,
    signer
  );

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
