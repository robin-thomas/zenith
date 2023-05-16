import type { Dispatch, SetStateAction } from 'react';

interface IDataProvider {
  wallet: any;
  setWallet: Dispatch<SetStateAction<any>>;
  paymentProcessing: boolean;
  setPaymentProcessing: Dispatch<SetStateAction<boolean>>;
}

export type IDataProviderContext = IDataProvider | Record<string, never>;

export type IDataProviderProps = {
  children: React.ReactNode;
};
