import { NextResponse } from 'next/server';

import { DqlSDK } from '@robinthomas/sxt-sdk';

import { APP_NAME_CAPS } from '@/constants/app';
import { TABLE_CAMPAIGN } from '@/constants/sxt';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const sdk = new DqlSDK({ host: process.env.SXT_HOST as string });

    const resourceId = `${APP_NAME_CAPS}.${TABLE_CAMPAIGN}`;

    const data = await sdk.query(
      `SELECT * FROM ${resourceId} WHERE id='${params.id}'`,
      {
        resourceId,
        biscuit: process.env.SXT_BISCUIT_CAMPAIGN as string,
        userId: process.env.SXT_USER_ID as string,
        privateKey: process.env.SXT_PRIVATE_KEY as string,
        publicKey: process.env.SXT_PUBLIC_KEY as string,
      }
    );

    if (data?.[0]) {
      return NextResponse.json(toCampaign(data[0]));
    }

    return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}

const toCampaign = (campaign: any) => ({
  id: campaign.ID,
  name: campaign.NAME,
  description: campaign.DETAIL,
  url: campaign.URL,
  created: Number.parseInt(campaign.CREATED_TIME),
});
