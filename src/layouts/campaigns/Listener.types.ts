import type { Dispatch, SetStateAction } from 'react';

export interface ListenerProps {
  open: boolean;
  setActiveStep: Dispatch<SetStateAction<number>>;
}
