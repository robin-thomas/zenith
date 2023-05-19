import Link from 'next/link';

import styles from './Preview.module.css';
import type { PreviewProps } from './Preview.types';

const getUrlLabel = (url: string) => {
  if (url.length > 65) {
    return `${url.substring(0, 65)}...`;
  }

  return url;
};

const Preview: React.FC<PreviewProps> = ({ name, url, description }) => (
  <>
    <Link href={url} target="_blank">
      <span className={styles.adname}>{name}</span>
    </Link>
    <p className={styles.addescription}>{description}</p>
    <p className={styles.adurl}>{getUrlLabel(url)}</p>
  </>
);

export default Preview;
