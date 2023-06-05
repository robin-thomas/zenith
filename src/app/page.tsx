'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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
import { APP_DESCRIPTION_SHORT, CURRENCY_SYMBOL, CURRENCY_NAME, APP_HOST } from '@/constants/app';
import { StatsCard } from '@/layouts/card';
import { HomeLink } from '@/layouts/link';

const Home: React.FC = () => {
  const { setWallet } = useAppContext();

  const [loggingIn, setLoggingIn] = useState(false);
  const [stats, setStats] = useState<Record<string, number>>({});

  useEffect(() => {
    const fn = async () => {
      const resp = await fetch(`${APP_HOST}/api/stats`);
      const data = await resp.json();
      setStats(data);
    };

    fn();
  }, []);

  const login = async () => {
    setLoggingIn(true);

    try {
      const accounts = await loginWithMetamask();
      if (accounts && accounts.length > 0) {
        setWallet({ accounts });
      }
    } catch (err) {
      setLoggingIn(false);
    }
  };

  return (
    <div className={styles.mainContainer}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Logo />
        <Tooltip arrow title="Login with MetamMask">
          <LoadingButton
            variant="contained"
            sx={{ mt: -5 }}
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
          <div className={styles.descriptionExtra}>
            Powered by&nbsp;
            <HomeLink href="https://polygon.technology" title="Polygon" />,&nbsp;
            <HomeLink href="https://chain.link" title="Chainlink" />,&nbsp;
            <HomeLink href="https://www.spaceandtime.io" title="SxT" />,&nbsp;
            <HomeLink href="https://truflation.com" title="Truflation" />
          </div>
          <Link href="/about">
            <Button variant="contained" sx={{ mt: 2 }}>Learn More</Button>
          </Link>
        </Grid>
        <Grid item md={4}>
          <Grid container spacing={1} justifyContent="flex-start">
            <Grid item md={6} sx={{ mr: 1, mb: 1 }}>
              <StatsCard
                icon={<AccountBalanceRoundedIcon sx={{ color: '#8168eb' }} />}
                title="Deposits"
                value={stats?.deposits !== undefined ? `${CURRENCY_SYMBOL} ${stats?.deposits}` : undefined}
                description={`Remaining ${CURRENCY_NAME} in smart contract`}
              />
            </Grid>
            <Grid item md={6}>
              <StatsCard
                icon={<AdsClickIcon sx={{ color: '#8168eb' }} />}
                title="Ad Clicks"
                value={stats?.adClicks}
                description="Total number of ad clicks for which rewards are collected"
              />
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
            <LinearProgress sx={{ mt: 1 }} />
          </>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
