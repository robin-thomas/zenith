/* eslint-disable no-console */
import { DdlSDK } from '@robinthomas/sxt-sdk';
import { config as dotenvConfig } from 'dotenv';

import { APP_NAME_CAPS } from '../src/constants/app';
import { TABLE_CAMPAIGN } from '../src/constants/sxt';

dotenvConfig();

const sdk = new DdlSDK({ host: process.env.SXT_HOST as string });

const resourceId = `${APP_NAME_CAPS}.${TABLE_CAMPAIGN}`;

(async () => {
  await sdk.query(
    `CREATE TABLE ${resourceId} (
      id VARCHAR PRIMARY KEY,
      name VARCHAR NOT NULL,
      detail VARCHAR NOT NULL,
      url VARCHAR NOT NULL,
      created_time VARCHAR NOT NULL
    ) WITH \"public_key=${process.env.SXT_BISCUIT_PUBLIC_KEY},access_type=public_write\"`,
    {
      biscuit: process.env.SXT_BISCUIT_CAMPAIGN,
      userId: process.env.SXT_USER_ID as string,
      privateKey: process.env.SXT_PRIVATE_KEY as string,
      publicKey: process.env.SXT_PUBLIC_KEY as string,
    }
  );

  console.log(`${resourceId} table created successfully`);
})();
