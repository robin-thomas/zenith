import TextField from '@mui/material/TextField';

import type { NewCampaignState } from './NewCampaign.types';

export interface TextInputProps {
  id: keyof NewCampaignState;
  label: string;
  placeholder?: string;
  rows?: number;
  type?: 'text' | 'number' | 'email' | 'password' | 'textarea';
  InputProps?: Partial<typeof TextField>;
}
