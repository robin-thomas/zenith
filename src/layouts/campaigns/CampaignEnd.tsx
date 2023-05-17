import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useFormikContext } from 'formik';
import dayjs from 'dayjs';

import type { NewCampaignState } from './NewCampaign.types';

const CampaignEnd: React.FC = () => {
  const { values, setFieldValue, touched, errors, handleBlur } = useFormikContext<NewCampaignState>();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        value={values.endDate}
        onChange={(value) => setFieldValue('endDate', value)}
        format="YYYY-MM-DD"
        label="Campaign End"
        minDate={dayjs().add(1, 'day').startOf('day') as unknown as string}
        slotProps={{
          textField: {
            id: 'endDate',
            fullWidth: true,
            variant: 'standard',
            margin: 'dense',
            helperText: touched.endDate ? errors.endDate : '',
            error: touched.endDate && Boolean(errors.endDate),
            onBlur: handleBlur,
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default CampaignEnd;
