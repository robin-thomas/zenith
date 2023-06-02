import { NextResponse } from 'next/server';

import { AlchemyProvider, Contract, Wallet } from 'ethers';

import AppContract from '../../../../solidity/artifacts/contracts/Zenith.sol/Zenith.json';
import { TRUFLATION_COUNTRIES, CHAIN_NAME } from '@/constants/app';

export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization') ?? req.headers.get('Authorization');
  const authKey = authHeader?.split(' ')?.[1];
  if (authKey !== process.env.AUTH_KEY) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const provider = new AlchemyProvider(CHAIN_NAME, process.env.ALCHEMY_KEY as string);
  const signer = new Wallet(process.env.PRIVATE_KEY as string, provider);

  const contract = new Contract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string,
    AppContract.abi,
    signer
  );

  const txnIds = [];
  for (const country of TRUFLATION_COUNTRIES) {
    const txn = await contract.requestCPI(country);
    txnIds.push(txn.hash);

    await txn.wait();
  }

  return NextResponse.json({ success: true, txnIds });
}
