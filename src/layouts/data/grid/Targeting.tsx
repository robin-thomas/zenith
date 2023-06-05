import { useState } from 'react';

import IconButton from '@mui/material/IconButton';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

import type { TargetingProps } from './Targeting.types';
import SelectOption from './SelectOption';
import { CURRENCY_NAME } from '@/constants/app';
import { walletAgeValueLabel, transactionCountValueLabel, walletBalanceValueLabel } from '@/utils/targeting';

const Targeting: React.FC<TargetingProps> = ({ targeting }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Tooltip title="See details about Campaign Targeting" arrow>
        <IconButton onClick={handleOpen}>
          <AdsClickIcon fontSize="inherit" color="success" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Campaign Targeting</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {targeting?.enabled && (
              <>
                <SelectOption
                  label="Wallet age is greater than or equal to   "
                  checked={targeting.enabled.walletAge}
                  value={targeting.walletAge}
                  valueLabel={walletAgeValueLabel(targeting.walletAge)}
                />
                <SelectOption
                  label="Number of transactions is greater than or equal to   "
                  checked={targeting.enabled.transactionCount}
                  value={targeting.transactionCount}
                  valueLabel={transactionCountValueLabel(targeting.transactionCount)}
                />
                <SelectOption
                  label={`${CURRENCY_NAME} balance is greater than or equal to  `}
                  checked={targeting.enabled.maticBalance}
                  value={targeting.maticBalance}
                  valueLabel={walletBalanceValueLabel(targeting.maticBalance)}
                />
                <SelectOption
                  label="Currently own or has owned an NFT"
                  checked={targeting.enabled.nft}
                />
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Targeting;
