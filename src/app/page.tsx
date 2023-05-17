'use client';

import { useState, useEffect } from 'react';
import { Poppins } from 'next/font/google';

import Logo from '@/layouts/logo/Logo';
import styles from './page.module.css';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import Tooltip from '@mui/material/Tooltip';
import LoadingButton from '@mui/lab/LoadingButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import { login as loginWithMetamask } from '@/utils/metamask';
import { useAppContext } from '@/hooks/useAppContext';

const poppins = Poppins({ weight: '600', subsets: ['latin'] });

interface StatProps {
  name: string;
  value?: number;
}

const Stat: React.FC<StatProps> = ({ name, value }) => (
  <Stack alignItems="center">
    <span className={poppins.className}>{name}</span>
    {value !== undefined ? (
      <span className={poppins.className}>{value}</span>
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
        setLoggingIn(false);
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
        <Stat name="Deposits" />
      </Stack>
      <Dialog open={loggingIn} disableEscapeKeyDown>
        <DialogContent>
          <DialogContentText>
            Waiting for MetaMask confirmation
          </DialogContentText>
          <LinearProgress />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Home;
