import { NextResponse } from 'next/server';

import { utils } from 'ethers';

import { getContract } from '@/utils/contract';

export async function GET() {
  const contract = await getContract();

  const campaigns = await contract.numCampaigns();
  const adClicks = await contract.numAdClicks();
  const deposits = await contract.provider.getBalance(contract.address);

  return NextResponse.json({
    campaigns: campaigns.toNumber(),
    adClicks: adClicks.toNumber(),
    deposits: utils.formatEther(deposits),
  });
}
