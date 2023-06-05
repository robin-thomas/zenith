import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { DmlSDK, DqlSDK } from '@robinthomas/sxt-sdk';

import { APP_NAME_CAPS } from '@/constants/app';
import { TABLE_CLICK } from '@/constants/sxt';
import { getPassportScore } from '@/utils/passport';
import { PASSPORT_THRESHOLD } from '@/constants/passport';
import { BIG_MAC_INDEX } from '@/constants/bigmac';

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get('country') || 'us';

  const { campaignId, advertiser, publisher, clicker, signature, viewed } = await request.json();

  // Verify the score is above threshold.
  const score = await getPassportScore(clicker);
  if (!score || score < PASSPORT_THRESHOLD) {
    return NextResponse.json({ error: 'not enough score' }, { status: 400 });
  }

  const { cpc, cpcDivideBy } = getCPC(country);

  const sdk = new DmlSDK({ host: process.env.SXT_HOST as string });

  const resourceId = `${APP_NAME_CAPS}.${TABLE_CLICK}`;

  const data = await sdk.query(
    `INSERT INTO ${resourceId}(
      campaign_id,
      advertiser,
      publisher,
      clicker,
      country,
      cpc,
      cpc_divide_by,
      signature,
      viewed_time
    )
    VALUES
    (
      ${campaignId.toString()},
      '${advertiser}',
      '${publisher}',
      '${clicker}',
      '${country}',
      '${cpc}',
      '${cpcDivideBy}',
      '${getSignature(signature)}',
      '${viewed}'
    )`,
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

const getSignature = (signature: string) => {
  if (signature.startsWith('0x')) {
    return signature.slice(2);
  }

  return signature;
};

const getCPC = (country: string) => {
  const cpcDivideBy = 1000;
  const _country = country.toLowerCase() as keyof typeof BIG_MAC_INDEX;
  const cpc = (BIG_MAC_INDEX[_country] ?? 0.500) * cpcDivideBy;

  return { cpc, cpcDivideBy };
};

const toClick = (click: any) => ({
  campaignId: Number.parseInt(click.CAMPAIGN_ID),
  advertiser: click.ADVERTISER,
  clicker: click.CLICKER,
  country: click.COUNTRY,
  signature: click.SIGNATURE,
  viewed: Number.parseInt(click.VIEWED_TIME),
});
