import './globals.css';

import DataProvider from '@/store/DataProvider';
import MetamaskProvider from '@/store/MetamaskProvider';

import styles from './layout.module.css';

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
      <head>
        <link rel="shortcut icon" href="/logo.png" />
      </head>
      <body>
        <DataProvider>
          <MetamaskProvider>
            <div className={styles.page}>
              <div className={styles.content}>
                <div className={styles.header}></div>
                {children}
              </div>
            </div>
          </MetamaskProvider>
        </DataProvider>
      </body>
    </html>
  );
}
