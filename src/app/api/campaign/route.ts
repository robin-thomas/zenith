import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';

import { DqlSDK, DmlSDK } from '@robinthomas/sxt-sdk';

import { APP_NAME_CAPS } from '@/constants/app';
import { TABLE_CAMPAIGN } from '@/constants/sxt';

export async function POST(request: Request) {
  const id = randomUUID();
  const { name, description, url, targeting } = await request.json();

  const sdk = new DmlSDK({ host: process.env.SXT_HOST as string });

  const resourceId = `${APP_NAME_CAPS}.${TABLE_CAMPAIGN}`;

  const data = await sdk.query(
    `INSERT INTO ${resourceId}(id, name, detail, url, targeting, created_time)
      VALUES('${id}', '${name}', '${description}', '${url}', '${targeting}', '${Date.now().toString()}')`,
    {
      resourceId,
      biscuit: process.env.SXT_BISCUIT_CAMPAIGN as string,
      userId: process.env.SXT_USER_ID as string,
      privateKey: process.env.SXT_PRIVATE_KEY as string,
      publicKey: process.env.SXT_PUBLIC_KEY as string,
    }
  );

  if (data?.[0].UPDATED === 1) {
    return NextResponse.json({ id });
  }

  throw new Error('Failed to create campaign');
}

export async function GET(request: Request) {
  try {
    const sdk = new DqlSDK({ host: process.env.SXT_HOST as string });

    const { sqlText, resourceId } = generateSql(request);

    const data = await sdk.query(
      sqlText,
      {
        resourceId,
        biscuit: process.env.SXT_BISCUIT_CAMPAIGN as string,
        userId: process.env.SXT_USER_ID as string,
        privateKey: process.env.SXT_PRIVATE_KEY as string,
        publicKey: process.env.SXT_PUBLIC_KEY as string,
      }
    );

    if (data?.[0]) {
      return NextResponse.json(data.map(toCampaign));
    }

    return NextResponse.json([]);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}

const generateSql = (request: Request) => {
  const resourceId = `${APP_NAME_CAPS}.${TABLE_CAMPAIGN}`;

  let sqlText = `SELECT * FROM ${resourceId}`;

  const url = new URL(request.url);
  const { searchParams } = url;
  const ids = searchParams.get('ids')?.split(',') ?? [];

  if (ids.length > 0) {
    sqlText += ` WHERE id IN ('${ids.join("','")}')`;
  }

  return { sqlText, resourceId };
};

const toCampaign = (campaign: any) => ({
  id: campaign.ID,
  name: campaign.NAME,
  description: campaign.DETAIL,
  url: campaign.URL,
  targeting: JSON.parse(campaign.TARGETING),
  created: Number.parseInt(campaign.CREATED_TIME),
});
