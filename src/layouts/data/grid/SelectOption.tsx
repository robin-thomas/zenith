import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';

import type { SelectOptionProps } from './SelectOption.types';
import styles from './SelectOption.module.css';

const SelectOption: React.FC<SelectOptionProps> = ({ value, checked, label, valueLabel }) => (
  <Stack direction="row" alignItems="center">
    <FormControlLabel
      control={(
        <Checkbox checked={checked} disabled />
      )}
      label=""
    />
    <span className={styles.label}>{label}</span>
    {value && (
      <FormControl variant="standard" sx={{ m: 1, minWidth: 100 }}>
        <Select value={value} disabled>
          <MenuItem value={value}>{valueLabel}</MenuItem>
        </Select>
      </FormControl>
    )}
  </Stack>
);

export default SelectOption;
