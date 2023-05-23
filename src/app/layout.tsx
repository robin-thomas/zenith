import { Poppins } from 'next/font/google';

import './globals.css';
import DataProvider from '@/store/DataProvider';
import MetamaskProvider from '@/store/MetamaskProvider';
import { APP_NAME } from '@/constants/app';
import styles from './layout.module.css';

const poppins = Poppins({ weight: '500', subsets: ['latin'] });

export const metadata = {
  title: APP_NAME,
  description: APP_NAME,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/logo.png" />
      </head>
      <body className={poppins.className}>
        <DataProvider>
          <MetamaskProvider>
            <div className={styles.page}>
              <div className={styles.content}>
                <div className={styles.header}></div>
                <div className={styles.contentContainer}>
                  {children}
                </div>
              </div>
            </div>
          </MetamaskProvider>
        </DataProvider>
      </body>
    </html>
  );
}
