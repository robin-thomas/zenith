import TextField from '@mui/material/TextField';

import type { NewCampaignState } from '@/layouts/newcampaign/index.types';

export interface TextInputProps {
  id: keyof NewCampaignState;
  label: string;
  placeholder?: string;
  rows?: number;
  description?: string;
  type?: 'text' | 'number' | 'email' | 'password' | 'textarea';
  InputProps?: Partial<typeof TextField>;
}
