import type { Dispatch, SetStateAction } from 'react';

interface IDataProvider {
  paymentProcessing: boolean;
  setPaymentProcessing: Dispatch<SetStateAction<boolean>>;
}

export type IDataProviderContext = IDataProvider | Record<string, never>;

export type IDataProviderProps = {
  children: React.ReactNode;
};
