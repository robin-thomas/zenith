import Image from 'next/image';
import { Montserrat_Alternates } from 'next/font/google';

import styles from './Logo.module.css';

const montserrat_alternates = Montserrat_Alternates({ weight: '700', subsets: ['latin'] });

const Logo = () => (
  <div className={styles.appname}>
    <Image src="/logo.png" width="40" height="17" alt="logo" />&nbsp;
    <span className={montserrat_alternates.className}>Zenith.</span>
  </div>
);

export default Logo;
