'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Rajdhani, Poppins } from 'next/font/google';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import CampaignIcon from '@mui/icons-material/Campaign';

import NewCampaign from '@/layouts/campaigns/NewCampaign';
import styles from './page.module.css';
import DataProvider from '@/store/DataProvider';
import MetamaskProvider from '@/store/MetamaskProvider';

const rajdhani = Rajdhani({ weight: '700', subsets: ['latin'] });
const poppins = Poppins({ weight: '300', subsets: ['latin'] });

const Campaigns: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <DataProvider>
      <MetamaskProvider>
        <div className={styles.page}>
          <div className={styles.content}>
            <Grid container className={styles.container}>
              <Grid md={2} className={styles.leftmenu}>
                <div className={styles.appname}>
                  <span className={rajdhani.className}>Zenith</span>
                </div>
                <Stack direction="column" spacing={2} className={styles.appmenu}>
                  <Grid container alignItems="center">
                    <Grid md={3}>
                      <CampaignIcon />
                    </Grid>
                    <Grid md={7}>
                      <Link href="/campaigns"><span className={poppins.className}>Campaigns</span></Link>
                    </Grid>
                  </Grid>
                </Stack>
                <div className={styles.appfooter}>
                  <Button variant="contained" fullWidth onClick={() => setOpen(true)}>New Campaign</Button>
                  <NewCampaign open={open} onClose={() => setOpen(false)} />
                </div>
              </Grid>
              <Grid md={10} className={styles.pagecontent}>
                <div className={styles.title}>
                  <span className={poppins.className}>Campaigns</span>
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      </MetamaskProvider>
    </DataProvider>
  );
}

export default Campaigns;
