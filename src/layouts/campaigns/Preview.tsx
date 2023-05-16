import type { FC } from 'react';
import Link from 'next/link';

import { useFormikContext } from 'formik';

import type { NewCampaignState } from './NewCampaign.types';
import { PLACEHOLDER_NAME, PLACEHOLDER_DESCRIPTION, PLACEHOLDER_URL } from './config';
import styles from './Preview.module.css';

const getUrlLabel = (url: string) => {
  if (url) {
    if (url.length > 65) {
      return `${url.substring(0, 65)}...`;
    }

    return url;
  }

  return PLACEHOLDER_URL;
}

const Preview: FC = () => {
  const { values } = useFormikContext<NewCampaignState>();

  return (
    <>
      <Link href={values.url || PLACEHOLDER_URL} target="_blank">
        <span className={styles.adname}>
          {values.name || PLACEHOLDER_NAME}
        </span>
      </Link>
      <p className={styles.addescription}>{values.description || PLACEHOLDER_DESCRIPTION}</p>
      <p className={styles.adurl}>{getUrlLabel(values.url)}</p>
    </>
  );
}

export default Preview;
