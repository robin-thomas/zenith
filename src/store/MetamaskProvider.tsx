'use client';

import { useEffect }  from 'react';
import { useRouter } from 'next/navigation';

import detectEthereumProvider from '@metamask/detect-provider';

import { useAppContext } from '@/hooks/useAppContext';
import type { IMetamaskProviderProps } from './MetamaskProvider.types';

const MetamaskProvider: React.FC<IMetamaskProviderProps> = ({ children }) => {
  const { wallet, setWallet } = useAppContext();
  const router = useRouter();

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

        // window.ethereum.on('accountsChanged', refreshAccounts);
        // window.ethereum.on('chainChanged', () => setWallet(undefined));
      }
    };

    if (!window.sessionStorage.getItem('zenith.user.logout')) {
      getProvider();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!wallet) {
      router.push(window.location.pathname ?? '/');
    } else if (window.location.pathname !== '/') {
      router.push(window.location.pathname);
    } else {
      router.push('/user/campaigns');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet]);

  return <>{children}</>;
};

export default MetamaskProvider;
