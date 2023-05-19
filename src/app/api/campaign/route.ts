import { NextResponse } from 'next/server';

import { NFTStorage, Blob } from 'nft.storage';

export async function POST() {
  const client = new NFTStorage({ token: process.env.NFT_STORAGE_KEY as string });

  const data = new Blob([JSON.stringify({
    name: 'Chainlink: The Industry-Standard Web3 Services Platform',
    description: 'Chainlink is a decentralized blockchain oracle network intended to be used to facilitate the transfer of tamper-proof data from off-chain sources to on-chain smart contracts.',
    url: 'https://chain.link',
    created: new Date().toISOString(),
  })]);

  const cid = await client.storeBlob(data);

  return NextResponse.json({ cid });
}
