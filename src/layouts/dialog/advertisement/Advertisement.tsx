import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import type { AdvertisementProps } from './Advertisement.types';

const Advertisement: React.FC<AdvertisementProps> = ({ open, handleClose, onYes }) => (
  <Dialog open={open} onClose={handleClose}>
    <DialogContent>
      <DialogContentText>
        You will be asked to sign a message using Metamask to confirm your view of this advertisement. Proceed?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose}>No</Button>
      <Button onClick={onYes}>Yes</Button>
    </DialogActions>
  </Dialog>
);

export default Advertisement;
