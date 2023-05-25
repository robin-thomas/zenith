# SxT NodeJS SDK

## Installation

```
$ npm install @robinthomas/sxt-sdk
```

## Features

- Tiny 4KB bundled library
- Zero dependencies
- Session management
  - Uses refresh tokens to generate new access tokens
- SQL support for:
  - [DDL](https://docs.spaceandtime.io/docs/sql-commands#ddl)
  - [DML](https://docs.spaceandtime.io/docs/sql-commands#dml)
  - [DQL](https://docs.spaceandtime.io/docs/sql-commands#dql)

## Pre-Requisites

1. Create an empty `.env` file
  - Add `SXT_HOST` (refer to SxT welcome email)
2. Complete the steps mentioned at https://docs.spaceandtime.io/docs/space-and-time-cli
  - At the end of which, you shall have:
    - `SXT_USER_ID`
    - `SXT_PRIVATE_KEY`
    - `SXT_PUBLIC_KEY`
  - Add those to the `.env` file.
3. Complete the steps mentioned at https://docs.spaceandtime.io/docs/space-and-time-cli-biscuit
  - At the end of which, you shall have:
    - `SXT_BISCUIT_PUBLIC_KEY`
    - `SXT_BISCUIT_PRIVATE_KEY`
  - Add those to the `.env` file
4. Create a biscuit with the following code:
```
$ sxtcli biscuit generate table --privateKey="<SXT_BISCUIT_PRIVATE_KEY>" --resources="<resourceId>" --operations="CREATE,ALTER,DROP,INSERT,UPDATE,MERGE,DELETE,SELECT"
```

`resourceId` is `SCHEMA.TABLE`.

Add the response of the above operation as `SXT_BISCUIT` to the `.env` file

## Operations

### DDL

Example below shows how to create a new table.

```
import { DdlSDK } from '@robinthomas/sxt-sdk';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const sdk = new DdlSDK({ host: process.env.SXT_HOST });

const data = await sdk.query(
  `CREATE TABLE ${SCHEMA}.${TABLE} (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    detail VARCHAR NOT NULL
  ) WITH \"public_key=${process.env.SXT_BISCUIT_PUBLIC_KEY},access_type=public_write\"`,
  {
    biscuit: process.env.SXT_BISCUIT,
    userId: process.env.SXT_USER_ID,
    privateKey: process.env.SXT_PRIVATE_KEY,
    publicKey: process.env.SXT_PUBLIC_KEY,
  }
);
```

### DML

Example below shows how to insert data into a table.

```
import { DmlSDK } from '@robinthomas/sxt-sdk';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const sdk = new DmlSDK({ host: process.env.SXT_HOST });

(async () => {
  const data = await sdk.query(
    `INSERT INTO ${SCHEMA}.${TABLE} (id, name, detail)
      VALUES('${id}', '${name}', '${detail}')`,
    {
      resourceId: `${SCHEMA}.${TABLE}`,
      biscuit: process.env.SXT_BISCUIT,
      userId: process.env.SXT_USER_ID,
      privateKey: process.env.SXT_PRIVATE_KEY,
      publicKey: process.env.SXT_PUBLIC_KEY,
    }
  );

  console.log(data);
})();
```

### DQL

Example below shows how to read data from the table.

```
import { DqlSDK } from '@robinthomas/sxt-sdk';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const sdk = new DqlSDK({ host: process.env.SXT_HOST });

(async () => {
  const data = await sdk.query(
    `SELECT * FROM ${SCHEMA}.${TABLE}`,
    {
      resourceId: `${SCHEMA}.${TABLE}`,
      biscuit: process.env.SXT_BISCUIT,
      userId: process.env.SXT_USER_ID,
      privateKey: process.env.SXT_PRIVATE_KEY,
      publicKey: process.env.SXT_PUBLIC_KEY,
    }
  );

  console.log(data);
})();
```
