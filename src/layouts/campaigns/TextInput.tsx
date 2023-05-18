import TextField from '@mui/material/TextField';
import { useFormikContext } from 'formik';
import Tooltip from '@mui/material/Tooltip';

import type { TextInputProps } from './TextInput.types';
import type { NewCampaignState } from './NewCampaign.types';

const TextInput: React.FC<TextInputProps> = ({ type, id, label, placeholder, rows, description, InputProps }) => {
  const { values, touched, errors, handleChange, handleBlur } = useFormikContext<NewCampaignState>();

  const multiLineProps = rows ? { rows, multiline: true } : {};

  return (
    <Tooltip arrow title={description}>
      <TextField
        type={type ?? 'text'}
        id={id}
        label={label}
        placeholder={placeholder}
        value={values[id]}
        onChange={handleChange}
        onBlur={handleBlur}
        helperText={touched[id] ? errors[id] as string : ''}
        error={touched[id] && Boolean(errors[id])}
        margin="dense"
        variant="standard"
        fullWidth
        InputProps={InputProps}
        {...multiLineProps}
      />
    </Tooltip>
  );
};

export default TextInput;
