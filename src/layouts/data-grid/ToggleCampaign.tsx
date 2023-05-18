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
import { toggleCampaignStatus } from '@/utils/metamask';

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const ToggleCampaign: React.FC<ToggleCampaignProps> = ({ status, icon, campaignId }) => {
  const [open, setOpen] = useState(false);

  const onYes = async () => {
    await toggleCampaignStatus(campaignId, status);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Tooltip title={`${capitalize(status)} this campaign`} arrow>
        <IconButton onClick={handleOpen}>{icon}</IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{capitalize(status)}?</DialogTitle>
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
