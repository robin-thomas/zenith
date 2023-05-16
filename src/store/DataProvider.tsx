import { createContext, useMemo, useState } from 'react';
import type { FC } from 'react';

import type { IDataProviderContext, IDataProviderProps } from './DataProvider.types';

const DataContext = createContext<IDataProviderContext>({});

const DataProvider: FC<IDataProviderProps> = ({ children }) => {
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const value = useMemo(
    () => ({
      paymentProcessing,
      setPaymentProcessing,
    }),
    [
      paymentProcessing,
      setPaymentProcessing,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export { DataContext };
export default DataProvider;
