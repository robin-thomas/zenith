/* eslint-disable no-console */

/**
 * @dev npm run migration --file=./migrations/4_delete_table_click.ts
 */

import { DdlSDK } from '@robinthomas/sxt-sdk';
import { config as dotenvConfig } from 'dotenv';

import { APP_NAME_CAPS } from '../src/constants/app';
import { TABLE_CLICK } from '../src/constants/sxt';

dotenvConfig();

const sdk = new DdlSDK({ host: process.env.SXT_HOST as string });

const resourceId = `${APP_NAME_CAPS}.${TABLE_CLICK}`;

(async () => {
  await sdk.query(
    `DROP TABLE ${resourceId}`,
    {
      biscuit: process.env.SXT_BISCUIT_CLICK,
      userId: process.env.SXT_USER_ID as string,
      privateKey: process.env.SXT_PRIVATE_KEY as string,
      publicKey: process.env.SXT_PUBLIC_KEY as string,
    }
  );

  console.log(`${resourceId} table dropped successfully`);
})();
