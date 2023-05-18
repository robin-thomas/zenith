import { NextResponse } from 'next/server';

import { getContract } from '@/utils/contract';

export async function GET() {
  const contract = await getContract();

  const campaigns = await contract.numCampaigns();
  const adClicks = await contract.numAdClicks();
  // const totalRewards = await contract.totalRewards();

  return NextResponse.json({
    campaigns: campaigns.toNumber(),
    adClicks: adClicks.toNumber(),
    totalRewards: 0,
  });
}
