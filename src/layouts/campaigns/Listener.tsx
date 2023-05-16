import { useEffect } from 'react';
import type { FC } from 'react';

import { useFormikContext } from "formik";

import type { ListenerProps } from './Listener.types';
import type { NewCampaignState } from "./NewCampaign.types";

const Listener: FC<ListenerProps> = ({ open, setActiveStep }) => {
  const { resetForm } = useFormikContext<NewCampaignState>();

  useEffect(() => {
    if (!open) {
      setActiveStep(0);
      resetForm();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return null;
}

export default Listener;
