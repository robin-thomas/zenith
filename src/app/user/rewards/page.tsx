'use client';

import { useState, useEffect } from 'react';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Skeleton from '@mui/material/Skeleton';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';
import RedeemIcon from '@mui/icons-material/Redeem';

import { Title } from '@/layouts/typography';
import { requestRewards } from '@/utils/metamask';
import { useAppContext } from '@/hooks/useAppContext';
import { StatsCard } from '@/layouts/card';
import { MetaMaskDialog } from '@/layouts/dialog';
import { getHumanError } from '@/utils/utils';

const Rewards: React.FC = () => {
  const [txn, setTxn] = useState<any>();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string>();
  const [openMetaMask, setOpenMetaMask] = useState(false);
  const [showRewardsBtn, setShowRewardsBtn] = useState<boolean>();

  const { wallet } = useAppContext();

  useEffect(() => {
    const fn = async () => {
      const address = wallet.accounts[0];

      const resp = await fetch(`/api/click?user=${address}`);
      const clicks = await resp.json();

      if (clicks?.length > 0) {
        setShowRewardsBtn(true);
      } else {
        setShowRewardsBtn(false);
      }
    };

    if (wallet) {
      fn();
    }
  }, [wallet]);

  const onClick = async () => {
    handleClose();
    setOpenMetaMask(true);

    try {
      const _txn = await requestRewards();
      setTxn(_txn);
    } catch (err) {
      setError(getHumanError(err as Error));
      reset();
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const reset = () => {
    setTimeout(() => {
      setOpenMetaMask(false);
      setError(undefined);
      setTxn(undefined);
    }, 4000);
  };

  return (
    <>
      <Title title="Rewards" />
      {showRewardsBtn === true ? (
        <>
          <p>You can request your pending rewards be transferred to your wallet by clicking below button.</p>
          <Button
            sx={{ mt: 1 }}
            variant="contained"
            onClick={handleOpen}
            startIcon={<RedeemIcon />}
          >
            Request Rewards
          </Button>
        </>
      ) : showRewardsBtn === undefined ? (
        <Skeleton variant="rectangular" width={200} height={50} />
      ) : null}
      <Grid container sx={{ mt: 1 }} spacing={3}>
        <Grid item md={3}>
          <StatsCard
            icon={<AccountBalanceRoundedIcon />}
            title="Received"
            value={0}
          />
        </Grid>
        <Grid item md={3}>
          <StatsCard icon={<AdsClickIcon />} title="Clicks" value={0} />
        </Grid>
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <DialogContentText>
            You&apos;ll be asked to create a MetaMask transaction (which costs gas fees)
            to request your rewards. Proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>No</Button>
          <Button onClick={onClick}>Yes</Button>
        </DialogActions>
      </Dialog>
      <MetaMaskDialog
        open={openMetaMask}
        error={error}
        txn={txn}
        resetHandler={reset}
        successMessage="Your rewards should arrive in your wallet within 5 minutes."
      />
    </>
  );
};

export default Rewards;
