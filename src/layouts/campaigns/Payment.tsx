import { useState } from 'react';
import type { FC } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import { useFormikContext } from 'formik';

import type { NewCampaignState } from './NewCampaign.types';
import type { PaymentProps } from './Payment.types';

const Payment: FC<PaymentProps> = ({ setActiveStep }) => {
  const { values } = useFormikContext<NewCampaignState>();

  const [loading, setLoading] = useState(false);

  const onClick = () => {
    setLoading(true);
    setTimeout(() => {
      setActiveStep(index => index + 1);
    }, 2000);
  }

  return (
    <>
      <LoadingButton
        variant="contained"
        color="primary"
        sx={{ marginTop: 1 }}
        onClick={onClick}
        loading={loading}
      >
        Pay {values.budget} Ether
      </LoadingButton>
    </>
  );
};

export default Payment;
