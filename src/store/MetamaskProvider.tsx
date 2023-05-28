'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { BrowserProvider } from 'ethers';

import { useAppContext } from '@/hooks/useAppContext';
import type { IMetamaskProviderProps } from './MetamaskProvider.types';
import { CHAIN_ID } from '@/constants/app';

const accountChanged = () => window.location.reload();

const MetamaskProvider: React.FC<IMetamaskProviderProps> = ({ children }) => {
  const { wallet, setWallet } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    const refreshAccounts = (accounts: any) => {
      if (accounts?.length > 0) {
        setWallet({ accounts });
      } else {
        setWallet(undefined);
      }
    };

    const getProvider = async () => {
      const provider = new BrowserProvider(window.ethereum);

      if (provider) {
        const chainId = await provider.send('eth_chainId', []);
        if (chainId === CHAIN_ID) {
          const accounts = await provider.send('eth_accounts', []);

          refreshAccounts(accounts);

          window.ethereum.on('accountsChanged', accountChanged);
          window.ethereum.on('chainChanged', accountChanged);
        }
      }
    };

    if (!window.sessionStorage.getItem('zenith.user.logout')) {
      getProvider();
    }

    return () => {
      window.ethereum.removeListener('accountsChanged', accountChanged);
      window.ethereum.removeListener('chainChanged', accountChanged);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!wallet) {
      router.push(window.location.pathname === '/about' ? '/about' : '/');
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
