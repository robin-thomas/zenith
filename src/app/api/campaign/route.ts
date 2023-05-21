import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';

import { DmlSDK } from '@robinthomas/sxt-sdk';

import { APP_NAME_CAPS } from '@/constants/app';
import { TABLE_CAMPAIGN } from '@/constants/sxt';

export async function POST(request: Request) {
  const id = randomUUID();
  const { name, description, url } = await request.json();

  const sdk = new DmlSDK({ host: process.env.SXT_HOST as string });

  const resourceId = `${APP_NAME_CAPS}.${TABLE_CAMPAIGN}`;

  const data = await sdk.query(
    `INSERT INTO ${resourceId}(id, name, detail, url, created_time)
      VALUES('${id}', '${name}', '${description}', '${url}', '${Date.now().toString()}')`,
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
