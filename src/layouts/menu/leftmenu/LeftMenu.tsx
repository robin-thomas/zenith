import { useState } from 'react';
import type { FC } from 'react';
import { Poppins, Rajdhani } from 'next/font/google';
import Link from 'next/link';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';

import { items } from '@/constants/leftmenu';
import NewCampaign from '@/layouts/campaigns/NewCampaign';
import styles from './LeftMenu.module.css';

const poppins = Poppins({ weight: '300', subsets: ['latin'] });
const rajdhani = Rajdhani({ weight: '700', subsets: ['latin'] });

const LeftMenu: FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className={styles.appname}>
        <span className={rajdhani.className}>Zenith</span>
      </div>
      <Stack direction="column" spacing={4} className={styles.appmenu}>
        {items.map((item) => (
          <Grid key={item.name} container alignItems="center">
            <Grid md={3}>
              {item.icon}
            </Grid>
            <Grid md={9}>
              <Link href={item.href}>
                <span className={poppins.className}>{item.name}</span>
              </Link>
            </Grid>
          </Grid>
        ))}
      </Stack>
      <div className={styles.appfooter}>
        <Button variant="contained" fullWidth onClick={() => setOpen(true)}>New Campaign</Button>
        <NewCampaign open={open} onClose={() => setOpen(false)} />
      </div>
    </>
  );
};

export default LeftMenu;
