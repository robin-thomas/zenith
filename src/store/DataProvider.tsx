'use client';

import { createContext, useMemo, useState } from 'react';

import type { IDataProviderContext, IDataProviderProps } from './DataProvider.types';

const DataContext = createContext<IDataProviderContext>({});

const DataProvider: React.FC<IDataProviderProps> = ({ children }) => {
  const [wallet, setWallet] = useState<any>();
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const value = useMemo(
    () => ({
      wallet,
      setWallet,
      paymentProcessing,
      setPaymentProcessing,
    }),
    [
      wallet,
      setWallet,
      paymentProcessing,
      setPaymentProcessing,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export { DataContext };
export default DataProvider;
