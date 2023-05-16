import { useState } from 'react';
import type { FC } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import { useFormikContext } from 'formik';

import type { NewCampaignState } from './NewCampaign.types';
import type { PaymentProps } from './Payment.types';
import styles from './Payment.module.css';

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
      <p className={styles.description}>
        Clicking on the below button will open MetaMask and ask you to confirm the transaction.
      </p>
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
