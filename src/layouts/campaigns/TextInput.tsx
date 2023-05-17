import TextField from '@mui/material/TextField';
import { useFormikContext } from 'formik';

import type { TextInputProps } from './TextInput.types';
import type { NewCampaignState } from './NewCampaign.types';

const TextInput: React.FC<TextInputProps> = ({ type, id, label, placeholder, rows, InputProps }) => {
  const { values, touched, errors, handleChange, handleBlur } = useFormikContext<NewCampaignState>();

  const multiLineProps = rows ? { rows, maxRows: rows, multiline: true } : {};

  return (
    <TextField
      type={type ?? 'text'}
      id={id}
      label={label}
      placeholder={placeholder}
      value={values[id]}
      onChange={handleChange}
      onBlur={handleBlur}
      helperText={touched[id] ? errors[id] : ''}
      error={touched[id] && Boolean(errors[id])}
      margin="dense"
      variant="standard"
      fullWidth
      InputProps={InputProps}
      {...multiLineProps}
    />
  );
};

export default TextInput;
