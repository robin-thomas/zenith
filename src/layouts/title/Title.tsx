import { Poppins } from 'next/font/google';

import type { TitleProps } from './Title.types';
import styles from './Title.module.css';

const poppins = Poppins({ weight: '300', subsets: ['latin'] });

const Title: React.FC<TitleProps> = ({ title }) => (
  <div className={styles.title}>
    <span className={poppins.className}>{title}</span>
  </div>
)

export default Title;
