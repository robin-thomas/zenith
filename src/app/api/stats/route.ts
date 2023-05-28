import { NextResponse } from 'next/server';

import { formatEther } from 'ethers';

import { getContract } from '@/utils/contract';

export async function GET() {
  const { contract, provider } = await getContract();

  const campaigns = await contract.numCampaigns();
  const adClicks = await contract.numAdClicks();
  const deposits = await provider.getBalance(contract.target);

  return NextResponse.json({
    campaigns: Number(campaigns),
    adClicks: Number(adClicks),
    deposits: Number.parseFloat(formatEther(deposits)).toFixed(4),
  });
}
