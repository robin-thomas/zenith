import LoadingButton from '@mui/lab/LoadingButton';
import { useFormikContext } from 'formik';

import type { NewCampaignState } from './NewCampaign.types';
import type { PaymentProps } from './Payment.types';
import styles from './Payment.module.css';
import { useAppContext } from '@/hooks/useAppContext';
import { PLACEHOLDER_DESCRIPTION, PLACEHOLDER_NAME, PLACEHOLDER_URL } from '@/constants/campaign';
import { pay } from '@/utils/metamask';

const Payment: React.FC<PaymentProps> = ({ setActiveStep }) => {
  const { values } = useFormikContext<NewCampaignState>();

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

    await pay(payload);

    setPaymentProcessing(false);
    setActiveStep(index => index + 1);
  };

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
        loading={paymentProcessing}
      >
        Pay {values.budget} Ether
      </LoadingButton>
    </>
  );
};

export default Payment;
