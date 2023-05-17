import './globals.css';

import DataProvider from '@/store/DataProvider';
import MetamaskProvider from '@/store/MetamaskProvider';

export const metadata = {
  title: 'Zenith',
  description: 'Zenith',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <DataProvider>
          <MetamaskProvider>
            {children}
          </MetamaskProvider>
        </DataProvider>
      </body>
    </html>
  );
}
