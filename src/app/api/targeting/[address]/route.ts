import { NextResponse } from 'next/server';

import { DqlSDK } from '@robinthomas/sxt-sdk';
import dayjs from 'dayjs';
import { formatEther, getAddress } from 'ethers';

export async function GET(_: Request, { params }: { params: { address: string } }) {
  const address = getAddress(params.address);

  const sdk = new DqlSDK({ host: process.env.SXT_HOST as string });

  /**
   * @dev TXN_COUNT will have a maximum value of 10, since in campaign targeting that's the highest value
   * that can be set (SQL optimisation).
   */

  const resourceId = 'MUMBAI2.TRANSACTIONS';
  const sqlText = `
    SELECT
      TXNS.TXN_COUNT,
      WALLET.BALANCE,
      AGE.WALLET_FIRST_TXN_DATE,
      NFT.TO_ AS OWNED_NFT
    FROM
    (
      SELECT COUNT(TIME_STAMP) AS TXN_COUNT
      FROM
      (
        SELECT TIME_STAMP
        FROM MUMBAI2.TRANSACTIONS
        WHERE FROM_ADDRESS='${address}'
        LIMIT 10
      )
    ) AS TXNS
    LEFT JOIN (
      SELECT
        CAST(TIME_STAMP AS DATE) AS WALLET_FIRST_TXN_DATE,
        FROM_ADDRESS
      FROM MUMBAI2.TRANSACTIONS
      WHERE FROM_ADDRESS='${address}'
      ORDER BY TIME_STAMP ASC
      LIMIT 1
    ) AS AGE ON AGE.FROM_ADDRESS = '${address}'
    LEFT JOIN (
      SELECT TO_
      FROM MUMBAI2.ERC721_TRANSFER
      WHERE TO_ = '${address}'
      LIMIT 1
    ) AS NFT ON NFT.TO_ = '${address}'
    LEFT JOIN (
      SELECT
        WALLET_ADDRESS,
        BALANCE
      FROM MUMBAI2.NATIVE_WALLET
      WHERE
        WALLET_ADDRESS='${address}'
      ORDER BY TIME_STAMP DESC
      LIMIT 1
    ) AS WALLET ON WALLET.WALLET_ADDRESS = '${address}'
  `;

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

  if (data[0].BALANCE) {
    data[0].BALANCE = Number.parseFloat(formatEther(data[0].BALANCE));
  }
  if (data[0].BALANCE === null) {
    data[0].BALANCE = 0;
  }

  if (data[0].OWNED_NFT !== undefined) {
    data[0].OWNED_NFT = Boolean(data[0].OWNED_NFT);
  }

  if (data[0].WALLET_FIRST_TXN_DATE) {
    data[0].WALLET_FIRST_TXN_DATE = dayjs(dayjs()).diff(data[0].WALLET_FIRST_TXN_DATE, 'days');
  }

  return NextResponse.json(toAccount(data[0]));
}

const toAccount = (data: any) => ({
  txnCount: data.TXN_COUNT,
  balance: data.BALANCE,
  walletAge: data.WALLET_FIRST_TXN_DATE,
  ownedNFT: data.OWNED_NFT,
});
