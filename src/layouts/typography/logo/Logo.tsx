import Image from 'next/image';
import Link from 'next/link';
import { Montserrat_Alternates } from 'next/font/google';

import styles from './Logo.module.css';
import { APP_NAME } from '@/constants/app';

const montserrat_alternates = Montserrat_Alternates({ weight: '700', subsets: ['latin'] });

const Logo = () => (
  <Link href="/">
    <div className={styles.appname}>
      <Image src="/logo.png" width="40" height="17" alt="logo" />&nbsp;
      <span className={montserrat_alternates.className}>{APP_NAME}.</span>
    </div>
  </Link>
);

export default Logo;
