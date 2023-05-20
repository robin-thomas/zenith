```
import { DdlSDK } from '@/../sxt-sdk/dist/index.js';

const sdk = new DdlSDK({ host: process.env.SXT_HOST });

const data = await sdk.query(
  `CREATE TABLE ${APP_NAME_CAPS}.${TABLE_CAMPAIGN} (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    detail VARCHAR NOT NULL,
    url VARCHAR NOT NULL,
    created_time VARCHAR NOT NULL
  ) WITH \"public_key=${process.env.SXT_BISCUIT_PUBLIC_KEY},access_type=public_write\"`,
  {
    biscuit: process.env.SXT_BISCUIT,
    userId: process.env.SXT_USER_ID,
    privateKey: process.env.SXT_PRIVATE_KEY,
    publicKey: process.env.SXT_PUBLIC_KEY,
  }
);

```
