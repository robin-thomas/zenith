import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { DmlSDK, DqlSDK } from '@robinthomas/sxt-sdk';

import { APP_NAME_CAPS } from '@/constants/app';
import { TABLE_CLICK } from '@/constants/sxt';

export async function POST(request: NextRequest) {
  const country = request.geo?.country;
  const { campaignId, advertiser, clicker, signature, viewed } = await request.json();

  const sdk = new DmlSDK({ host: process.env.SXT_HOST as string });

  const resourceId = `${APP_NAME_CAPS}.${TABLE_CLICK}`;

  const data = await sdk.query(
    `INSERT INTO ${resourceId}(campaign_id, advertiser, clicker, country, signature, viewed_time)
      VALUES(${campaignId.toString()}, '${advertiser}', '${clicker}', '${country}', '${signature}', '${viewed}')`,
    {
      resourceId,
      biscuit: process.env.SXT_BISCUIT_CLICK as string,
      userId: process.env.SXT_USER_ID as string,
      privateKey: process.env.SXT_PRIVATE_KEY as string,
      publicKey: process.env.SXT_PUBLIC_KEY as string,
    }
  );

  if (data?.[0].UPDATED === 1) {
    return NextResponse.json({ id: campaignId });
  }

  throw new Error('Failed to register ad click');
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const timestamp = searchParams.get('t') ?? '0';
  const clicker = searchParams.get('user');

  const sdk = new DqlSDK({ host: process.env.SXT_HOST as string });

  const resourceId = `${APP_NAME_CAPS}.${TABLE_CLICK}`;

  let sqlText = `SELECT * FROM ${resourceId} WHERE viewed_time > '${timestamp}'`;
  if (clicker) {
    sqlText += ` AND clicker = '${clicker.toLowerCase()}'`;
  }

  const data = await sdk.query(
    sqlText,
    {
      resourceId,
      biscuit: process.env.SXT_BISCUIT_CLICK as string,
      userId: process.env.SXT_USER_ID as string,
      privateKey: process.env.SXT_PRIVATE_KEY as string,
      publicKey: process.env.SXT_PUBLIC_KEY as string,
    }
  );

  return NextResponse.json(data?.map(toClick));
}

const toClick = (click: any) => ({
  campaignId: Number.parseInt(click.CAMPAIGN_ID),
  advertiser: click.ADVERTISER,
  clicker: click.CLICKER,
  country: click.COUNTRY,
  signature: click.SIGNATURE,
  viewed: Number.parseInt(click.VIEWED_TIME),
});
