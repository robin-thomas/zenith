'use client';

import { useEffect }  from 'react';

import detectEthereumProvider from '@metamask/detect-provider';

import { useAppContext } from '@/hooks/useAppContext';
import type { IMetamaskProviderProps } from './MetamaskProvider.types';

const MetamaskProvider: React.FC<IMetamaskProviderProps> = ({ children }) => {
  const { setWallet } = useAppContext();

  useEffect(() => {
    const refreshAccounts = (accounts: any) => {
      if (accounts.length > 0) {
        setWallet({ accounts });
      } else {
        setWallet(undefined);
      }
    };

    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true });

      if (provider) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });

        refreshAccounts(accounts);

        window.ethereum.on('accountsChanged', refreshAccounts);
        window.ethereum.on('chainChanged', () => setWallet(undefined));
      }
    };

    getProvider();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
};

export default MetamaskProvider;
