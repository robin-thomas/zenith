import Image from 'next/image';
import Link from 'next/link';
import { Montserrat_Alternates } from 'next/font/google';

import styles from './Logo.module.css';
import { APP_NAME } from '@/constants/app';
import type { LogoProps } from './Logo.types';

const montserrat_alternates = Montserrat_Alternates({ weight: '700', subsets: ['latin'] });

const LogoComponent = () => (
  <div className={styles.appname}>
    <Image src="/logo.png" width="40" height="17" alt="logo" />&nbsp;
    <span className={montserrat_alternates.className}>{APP_NAME}.</span>
  </div>
);

const Logo: React.FC<LogoProps> = ({ disableLink }) => {
  if (disableLink) {
    return <LogoComponent />;
  }

  return (
    <Link href="/">
      <LogoComponent />
    </Link>
  );
};

export default Logo;
