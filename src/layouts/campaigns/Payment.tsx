import LoadingButton from '@mui/lab/LoadingButton';
import { useFormikContext } from 'formik';

import type { NewCampaignState } from './NewCampaign.types';
import type { PaymentProps } from './Payment.types';
import styles from './Payment.module.css';
import { useAppContext } from '@/hooks/useAppContext';
import { login as loginMetamask } from '@/utils/metamask';

const Payment: React.FC<PaymentProps> = ({ setActiveStep }) => {
  const { values } = useFormikContext<NewCampaignState>();

  const { wallet, paymentProcessing, setPaymentProcessing } = useAppContext();

  const onClick = async () => {
    setPaymentProcessing(true);

    if (!wallet) {
      await loginMetamask();
    }

    setTimeout(() => {
      setPaymentProcessing(false);
      setActiveStep(index => index + 1);
    }, 2000);
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
