import Link from 'next/link';

import Chip from '@mui/material/Chip';

import styles from './Preview.module.css';
import type { PreviewProps } from './Preview.types';
import { APP_HOST } from '@/constants/app';

const getUrlLabel = (url: string) => {
  if (url?.length > 65) {
    return `${url.substring(0, 65)}...`;
  }

  return url;
};

const Preview: React.FC<PreviewProps> = ({ name, url, description, onClick }) => (
  <>
    {onClick && (
      <span onClick={onClick} className={styles.adname}>{name}</span>
    )}
    {!onClick && (
      <Link href={url} target="_blank">
        <span className={styles.adname}>{name}</span>
      </Link>
    )}
    <p className={styles.addescription}>{description}</p>
    <p className={styles.adurl}>{getUrlLabel(url)}</p>
  </>
);

const PreviewCard: React.FC<PreviewProps> = (props) => (
  <div style={{ border: '1px solid black', padding: '1rem', borderRadius: '0.2rem' }}>
    <Chip
      label="Advertisement"
      size="small"
      component="a"
      target="_blank"
      href={APP_HOST}
      clickable
      sx={{ mr: 1 }}
    />
    <Preview {...props} />
  </div>
);

export default PreviewCard;
