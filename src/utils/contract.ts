import { providers, Contract } from 'ethers';

import Zenith from '../../solidity/artifacts/contracts/Zenith.sol/Zenith.json';

export const getContract = async () => {
  const provider = new providers.AlchemyProvider('maticmum', process.env.ALCHEMY_KEY as string);
  return new Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string, Zenith.abi, provider);
};
