import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import { useFormikContext } from 'formik';

import type { NewCampaignState } from '@/layouts/newcampaign/index.types';
import type { NewCampaignActionsProps } from './NewCampaignActions.types';
import { useAppContext } from '@/hooks/useAppContext';

const NewCampaignActions: React.FC<NewCampaignActionsProps> = ({ activeStep, setActiveStep }) => {
  const { handleSubmit } = useFormikContext<NewCampaignState>();
  const { paymentProcessing } = useAppContext();

  const onNextStep = () => {
    if (activeStep === 0) {
      return handleSubmit();
    }
    setActiveStep(index => index + 1);
  };

  return activeStep < 4 ? (
    <DialogActions>
      <Button
        disabled={paymentProcessing || activeStep === 0}
        onClick={() => setActiveStep(index => index - 1)}
      >
        Previous
      </Button>
      <Button disabled={activeStep >= 3} onClick={onNextStep}>Next</Button>
    </DialogActions>
  ) : null;
};

export default NewCampaignActions;
