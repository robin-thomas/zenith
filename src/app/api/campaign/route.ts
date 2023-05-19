import { NextResponse } from 'next/server';

import { NFTStorage, Blob } from 'nft.storage';

export async function POST(request: Request) {
  const client = new NFTStorage({ token: process.env.NFT_STORAGE_KEY as string });

  const { name, description, url } = await request.json();

  const data = new Blob([JSON.stringify({
    name,
    description,
    url,
    created: new Date().toISOString(),
  })]);

  const cid = await client.storeBlob(data);

  return NextResponse.json({ cid });
}
