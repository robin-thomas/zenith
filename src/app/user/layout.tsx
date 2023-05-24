'use client';

import Grid from '@mui/material/Unstable_Grid2';

import { LeftMenu } from '@/layouts/menu';
import styles from './layout.module.css';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <Grid container className={styles.container}>
      <Grid md={2} className={styles.leftmenu}>
        <LeftMenu />
      </Grid>
      <Grid md={10} className={styles.pagecontent}>
        {children}
      </Grid>
    </Grid>
  );
};
