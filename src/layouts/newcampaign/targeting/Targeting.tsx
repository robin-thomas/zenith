import FormGroup from '@mui/material/FormGroup';
import Alert from '@mui/material/Alert';

import SelectOption from '@/layouts/newcampaign/targeting/SelectOption';
import { CURRENCY_NAME } from '@/constants/app';

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
        values={[
          { label: '1 day', value: '1' },
          { label: '1 week', value: '7' },
          { label: '1 month', value: '30' },
        ]}
      />
    </FormGroup>
    <FormGroup>
      <SelectOption
        id="transactionCount"
        label="Number of transactions is greater than or equal to   "
        values={[
          { label: '1 transaction', value: '1' },
          { label: '5 transactions', value: '5' },
          { label: '10 transactions', value: '10' },
        ]}
      />
    </FormGroup>
    <FormGroup>
      <SelectOption
        id="maticBalance"
        label={`${CURRENCY_NAME} balance is greater than or equal to  `}
        values={[
          { label: `0.1 ${CURRENCY_NAME}`, value: '0.1' },
          { label: `1 ${CURRENCY_NAME}`, value: '1' },
          { label: `10 ${CURRENCY_NAME}`, value: '10' },
        ]}
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
