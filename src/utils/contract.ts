import { AlchemyProvider, Contract } from 'ethers';

import AppContract from '../../solidity/artifacts/contracts/Zenith.sol/Zenith.json';
import { CHAIN_NAME } from '@/constants/app';

export const getContract = async () => {
  const provider = new AlchemyProvider(CHAIN_NAME, process.env.ALCHEMY_KEY as string);
  const contract = new Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string, AppContract.abi, provider);

  return { contract, provider };
};
