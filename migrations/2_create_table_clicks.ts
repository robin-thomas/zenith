/* eslint-disable no-console */
import { DdlSDK } from '@robinthomas/sxt-sdk';
import { config as dotenvConfig } from 'dotenv';

import { APP_NAME_CAPS } from '../src/constants/app';
import { TABLE_CLICK } from '../src/constants/sxt';

dotenvConfig();

const sdk = new DdlSDK({ host: process.env.SXT_HOST as string });

const resourceId = `${APP_NAME_CAPS}.${TABLE_CLICK}`;

(async () => {
  await sdk.query(
    `CREATE TABLE ${resourceId} (
      campaign_id INTEGER NOT NULL,
      clicker VARCHAR NOT NULL,
      advertiser VARCHAR NOT NULL,
      country_code VARCHAR NOT NULL,
      display_time VARCHAR NOT NULL,
      PRIMARY KEY(campaign_id, clicker)
    ) WITH \"public_key=${process.env.SXT_BISCUIT_PUBLIC_KEY},access_type=public_write\"`,
    {
      biscuit: process.env.SXT_BISCUIT_CLICK,
      userId: process.env.SXT_USER_ID as string,
      privateKey: process.env.SXT_PRIVATE_KEY as string,
      publicKey: process.env.SXT_PUBLIC_KEY as string,
    }
  );

  console.log('Table created successfully');
})();
