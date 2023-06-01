import Link from 'next/link';

import type { HomeLinkProps } from './HomeLink.types';
import styles from './HomeLink.module.css';

const HomeLink: React.FC<HomeLinkProps> = ({ href, title }) => (
  <Link href={href} target="_blank" className={styles.link}>{title}</Link>
);

export default HomeLink;
