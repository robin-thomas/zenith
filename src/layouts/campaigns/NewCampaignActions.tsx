import type { FC } from 'react';

import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import { useFormikContext } from 'formik';

import type { NewCampaignState } from './NewCampaign.types';
import type { NewCampaignActionsProps } from './NewCampaignActions.types';

const NewCampaignActions: FC<NewCampaignActionsProps> = ({ activeStep, setActiveStep }) => {
  const { handleSubmit, isSubmitting } = useFormikContext<NewCampaignState>();

  const onNextStep = () => {
    if (activeStep === 0) {
      return handleSubmit();
    }
    setActiveStep(index => index + 1);
  }

  return activeStep < 3 ? (
    <DialogActions>
      <Button disabled={isSubmitting || activeStep === 0} onClick={() => setActiveStep(index => index - 1)}>Previous</Button>
      <Button disabled={activeStep >= 2} onClick={onNextStep}>Next</Button>
    </DialogActions>
  ) : null;
};

export default NewCampaignActions;
