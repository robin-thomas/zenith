import type { AppProps } from 'next/app';

import DataProvider from '@/store/DataProvider';
import MetamaskProvider from '@/store/MetamaskProvider';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <DataProvider>
      <MetamaskProvider>
        <Component {...pageProps} />
      </MetamaskProvider>
    </DataProvider>
  );
}
