'use client';

import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import LoadingButton from '@mui/lab/LoadingButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded';
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';

import { Logo } from '@/layouts/typography';
import styles from './page.module.css';
import { login as loginWithMetamask } from '@/utils/metamask';
import { useAppContext } from '@/hooks/useAppContext';
import { APP_DESCRIPTION_SHORT, APP_DESCRIPTION_EXTRA, CURRENCY_SYMBOL } from '@/constants/app';
import { StatsCard } from '@/layouts/card';

const Home: React.FC = () => {
  const { setWallet } = useAppContext();

  const [loggingIn, setLoggingIn] = useState(false);
  const [stats, setStats] = useState<Record<string, number>>({});

  useEffect(() => {
    const fn = async () => {
      const resp = await fetch('/api/stats');
      const data = await resp.json();
      setStats(data);
    };

    fn();
  }, []);

  const login = async () => {
    setLoggingIn(true);

    try {
      const accounts = await loginWithMetamask();
      if (accounts?.length > 0) {
        setWallet({ accounts });
      }
    } catch (err) {
      setLoggingIn(false);
    }
  };

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" className={styles.logoContainer}>
        <Logo />
        <Tooltip arrow title="Login with MetamMask">
          <LoadingButton
            variant="contained"
            sx={{ marginTop: -5 }}
            onClick={login}
            loading={loggingIn}
          >
            Connect
          </LoadingButton>
        </Tooltip>
      </Stack>
      <Grid container className={styles.detailsContainer} justifyContent="space-around">
        <Grid item md={6}>
          <div className={styles.description}>{APP_DESCRIPTION_SHORT}</div>
          <div className={styles.descriptionExtra}>{APP_DESCRIPTION_EXTRA}</div>
          <Button variant="contained" sx={{ marginTop: 2 }}>Learn More</Button>
        </Grid>
        <Grid item md={4}>
          <Grid container spacing={1} justifyContent="flex-start">
            <Grid item md={6} sx={{ marginRight: 1, marginBottom: 1 }}>
              <StatsCard
                icon={<AccountBalanceRoundedIcon sx={{ color: '#8168eb' }} />}
                title="Deposits"
                value={stats?.deposits !== undefined ? `${CURRENCY_SYMBOL} ${stats?.deposits}` : undefined}
              />
            </Grid>
            <Grid item md={6}>
              <StatsCard icon={<AdsClickIcon sx={{ color: '#8168eb' }} />} title="Ad Clicks" value={stats?.adClicks} />
            </Grid>
            <Grid item md={6}>
              <StatsCard icon={<AddShoppingCartRoundedIcon sx={{ color: '#8168eb' }} />} title="Campaigns" value={stats?.campaigns} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Dialog open={loggingIn} disableEscapeKeyDown>
        <DialogContent>
          <>
            Waiting for MetaMask confirmation
            <LinearProgress sx={{ marginTop: 1 }} />
          </>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Home;
