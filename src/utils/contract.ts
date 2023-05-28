import { AlchemyProvider, Contract } from 'ethers';

import AppContract from '../../solidity/artifacts/contracts/Zenith.sol/Zenith.json';

export const getContract = async () => {
  const provider = new AlchemyProvider('maticmum', process.env.ALCHEMY_KEY as string);
  const contract = new Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string, AppContract.abi, provider);

  return { contract, provider };
};
