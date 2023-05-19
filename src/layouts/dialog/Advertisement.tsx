import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import type { AdvertisementProps } from './Advertisement.types';

const Advertisement: React.FC<AdvertisementProps> = ({ content, open, handleClose, onYes }) => (
  <Dialog open={open} onClose={handleClose}>
    <DialogTitle>Note</DialogTitle>
    <DialogContent>
      <DialogContentText>
        {content ?? 'You will be asked to sign a message using Metamask to confirm your view of this advertisement. Proceed?'}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose}>No</Button>
      <Button onClick={onYes}>Yes</Button>
    </DialogActions>
  </Dialog>
);

export default Advertisement;
