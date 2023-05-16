import type { Dispatch, SetStateAction } from 'react';

export interface PaymentProps {
  setActiveStep: Dispatch<SetStateAction<number>>
};
