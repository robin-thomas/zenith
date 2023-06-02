import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';

import type { SelectOptionProps } from './SelectOption.types';
import styles from './SelectOption.module.css';
import { useFormikContext } from 'formik';

const SelectOption: React.FC<SelectOptionProps> = ({ id, label, values }) => {
  const { values: formikValues, setFieldValue } = useFormikContext<any>();

  const checked = formikValues[`${id}Checked` as string];
  const value = formikValues[id as string];

  const onCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue(`${id}Checked`, e.target.checked);
  };

  const onSelect = (e: SelectChangeEvent<any>) => {
    setFieldValue(id, e.target.value);
  };

  return (
    <Stack direction="row" alignItems="center">
      <FormControlLabel
        control={(
          <Checkbox checked={checked} onChange={onCheck} />
        )}
        label=""
      />
      <span className={styles.label}>{label}</span>
      {values && (
        <FormControl variant="standard" sx={{ m: 1, minWidth: 100 }}>
          <Select value={value} onChange={onSelect} defaultValue={values[0].value}>
            {values.map(({ label, value }) => (
              <MenuItem key={value} value={value}>{label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Stack>
  );
};

export default SelectOption;
