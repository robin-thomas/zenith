import type { Dispatch, SetStateAction } from 'react';

export interface NewCampaignActionsProps {
  activeStep: number;
  setActiveStep: Dispatch<SetStateAction<number>>
};
