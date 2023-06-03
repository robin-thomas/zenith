import FormGroup from '@mui/material/FormGroup';
import Alert from '@mui/material/Alert';

import SelectOption from '@/layouts/newcampaign/targeting/SelectOption';
import { CURRENCY_NAME } from '@/constants/app';
import { WALLET_AGE_VALUES, WALLET_BALANCE_VALUES, TRANSACTION_COUNT_VALUES } from '@/constants/targeting';

const Targeting: React.FC = () => (
  <>
    <Alert
      variant="outlined"
      severity="info"
      sx={{ my: 1 }}
    >
      Select one or more options below to target your campaign audience.
    </Alert>
    <FormGroup>
      <SelectOption
        id="walletAge"
        label="Wallet age is greater than or equal to   "
        values={WALLET_AGE_VALUES}
      />
    </FormGroup>
    <FormGroup>
      <SelectOption
        id="transactionCount"
        label="Number of transactions is greater than or equal to   "
        values={TRANSACTION_COUNT_VALUES}
      />
    </FormGroup>
    <FormGroup>
      <SelectOption
        id="maticBalance"
        label={`${CURRENCY_NAME} balance is greater than or equal to  `}
        values={WALLET_BALANCE_VALUES}
      />
    </FormGroup>
    <FormGroup>
      <SelectOption
        id="nft"
        label="Currently own or has owned an NFT"
      />
    </FormGroup>
  </>
);

export default Targeting;
