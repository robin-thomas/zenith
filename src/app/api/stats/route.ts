import { NextResponse } from 'next/server';

import { providers, Contract } from 'ethers';

import Zenith from '../../../../artifacts/contracts/Zenith.sol/Zenith.json';

export async function GET() {
  const provider = new providers.AlchemyProvider('maticmum', process.env.ALCHEMY_KEY as string);
  const contract = new Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string, Zenith.abi, provider);

  const campaigns = await contract.numCampaigns();
  const adClicks = await contract.numAdClicks();
  // const totalRewards = await contract.totalRewards();

  return NextResponse.json({
    campaigns: campaigns.toNumber(),
    adClicks: adClicks.toNumber(),
    totalRewards: 0,
  });
}
