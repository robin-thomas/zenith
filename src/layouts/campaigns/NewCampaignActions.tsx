import type { FC } from 'react';

import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import { useFormikContext } from 'formik';

import type { NewCampaignState } from './NewCampaign.types';
import type { NewCampaignActionsProps } from './NewCampaignActions.types';
import { useAppContext } from '@/hooks/useAppContext';

const NewCampaignActions: FC<NewCampaignActionsProps> = ({ activeStep, setActiveStep, onClose }) => {
  const { handleSubmit } = useFormikContext<NewCampaignState>();
  const { paymentProcessing } = useAppContext();

  const onNextStep = () => {
    if (activeStep === 0) {
      return handleSubmit();
    }
    setActiveStep(index => index + 1);
  }

  return activeStep < 3 ? (
    <DialogActions>
      <Button onClick={onClose} disabled={paymentProcessing}>Cancel</Button>
      <div style={{ flex: '1 0 0' }} />
      <Button disabled={paymentProcessing || activeStep === 0} onClick={() => setActiveStep(index => index - 1)}>Previous</Button>
      <Button disabled={activeStep >= 2} onClick={onNextStep}>Next</Button>
    </DialogActions>
  ) : null;
};

export default NewCampaignActions;
