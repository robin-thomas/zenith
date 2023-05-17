interface IDataProvider {
  wallet: any;
  setWallet: React.Dispatch<React.SetStateAction<any>>;
  paymentProcessing: boolean;
  setPaymentProcessing: React.Dispatch<React.SetStateAction<boolean>>;
}

export type IDataProviderContext = IDataProvider | Record<string, never>;

export type IDataProviderProps = {
  children: React.ReactNode;
};
