import { useState } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import { useFormikContext } from 'formik';
import LinearProgress from '@mui/material/LinearProgress';

import type { NewCampaignState } from '@/layouts/newcampaign/index.types';
import type { PaymentProps } from './Payment.types';
import styles from './Payment.module.css';
import { useAppContext } from '@/hooks/useAppContext';
import { PLACEHOLDER_DESCRIPTION, PLACEHOLDER_NAME, PLACEHOLDER_URL } from '@/constants/campaign';
import { pay } from '@/utils/metamask';
import { CURRENCY_NAME } from '@/constants/app';
import { TransactionHashCard } from '@/layouts/card';

const Payment: React.FC<PaymentProps> = ({ setActiveStep }) => {
  const { values } = useFormikContext<NewCampaignState>();

  const [hash, setHash] = useState<string>();
  const { paymentProcessing, setPaymentProcessing } = useAppContext();

  const onClick = async () => {
    setPaymentProcessing(true);

    const payload = {
      name: values.name || PLACEHOLDER_NAME,
      description: values.description || PLACEHOLDER_DESCRIPTION,
      url: values.url || PLACEHOLDER_URL,
      budget: values.budget,
      costPerClick: values.costPerClick,
      endDate: values.endDate.unix(),
    };

    const txn = await pay(payload);
    setHash(txn.hash);

    await txn.wait();

    setPaymentProcessing(false);
    setActiveStep(index => index + 1);
  };

  if (hash) {
    return (
      <>
        Waiting for transaction to be mined
        <LinearProgress sx={{ mt: 1 }} />
        <TransactionHashCard hash={hash} />
      </>
    );
  }

  return (
    <>
      <p className={styles.description}>
        Clicking on the below button will open MetaMask and ask you to confirm the transaction.
      </p>
      <LoadingButton
        variant="contained"
        color="primary"
        sx={{ mt: 1 }}
        onClick={onClick}
        loading={paymentProcessing}
      >
        Pay {values.budget} {CURRENCY_NAME}
      </LoadingButton>
    </>
  );
};

export default Payment;
