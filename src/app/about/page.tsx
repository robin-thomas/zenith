'use client';

import Stack from '@mui/material/Stack';

import { Logo } from '@/layouts/typography';
import styles from './page.module.css';

const About: React.FC = () => {
  return (
    <div className={styles.mainContainer}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Logo />
      </Stack>
    </div>
  );
};

export default About;
