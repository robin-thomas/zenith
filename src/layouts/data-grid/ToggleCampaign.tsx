import { useState } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import type { ToggleCampaignProps } from './ToggleCampaign.types';
import { toggleCampaignStatus as toggleCmpMetamask } from '@/utils/metamask';
import MetamaskDialog from '@/layouts/dialog/MetamaskDialog';

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const getHumanError = (err: Error) => {
  if (err.message.includes('ACTION_REJECTED')) {
    return 'You have cancelled the transaction!';
  }

  return err.message;
};

const ToggleCampaign: React.FC<ToggleCampaignProps> = ({ status, icon, campaignId, toggleCampaignStatus }) => {
  const [open, setOpen] = useState(false);
  const [openMetamask, setOpenMetamask] = useState(false);
  const [error, setError] = useState<string>();
  const [txn, setTxn] = useState<any>();

  const reset = () => {
    setTimeout(() => {
      setOpenMetamask(false);
      setError(undefined);
      setTxn(undefined);
    }, 5000);
  };

  const onYes = async () => {
    handleClose();
    setOpenMetamask(true);

    try {
      const _txn = await toggleCmpMetamask(campaignId, status);
      setTxn(_txn);
    } catch (err) {
      setError(getHumanError(err as Error));
      reset();
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Tooltip title={`${capitalize(status)} this campaign`} arrow>
        <IconButton onClick={handleOpen}>{icon}</IconButton>
      </Tooltip>
      <MetamaskDialog
        open={openMetamask}
        error={error}
        txn={txn}
        resetHandler={reset}
        successHandler={toggleCampaignStatus}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {capitalize(status)}?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {status} this campaign?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>No</Button>
          <Button onClick={onYes}>Yes</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ToggleCampaign;
