'use client';

import { useState, useEffect } from 'react';

import Logo from '@/layouts/logo/Logo';
import styles from './page.module.css';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import LoadingButton from '@mui/lab/LoadingButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import LinearProgress from '@mui/material/LinearProgress';

import { login as loginWithMetamask } from '@/utils/metamask';
import { useAppContext } from '@/hooks/useAppContext';
import { CURRENCY_SYMBOL } from '@/constants/app';

interface StatProps {
  name: string;
  value?: number | string;
}

const Stat: React.FC<StatProps> = ({ name, value }) => (
  <Stack alignItems="center">
    <span>{name}</span>
    {value !== undefined ? (
      <span>{value}</span>
    ) : (
      <Skeleton variant="rounded" width={175} height={60} />
    )}
  </Stack>
);

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
      <div className={styles.detailsContainer}></div>
      <Stack spacing={10} direction="row" justifyContent="center" className={styles.statsContainer} >
        <Stat name="Campaigns" value={stats?.campaigns} />
        <Stat name="Ad Clicks" value={stats?.adClicks} />
        <Stat
          name="Deposits"
          value={stats?.deposits !== undefined ? `${CURRENCY_SYMBOL} ${stats?.deposits}` : undefined}
        />
      </Stack>
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
