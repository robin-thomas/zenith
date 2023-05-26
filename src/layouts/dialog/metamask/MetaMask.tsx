import { useState, useEffect } from 'react';

import LinearProgress from '@mui/material/LinearProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

import { TransactionHashCard } from '@/layouts/card';
import type { MetamaskDialogProps } from './MetaMask.types';

const MetamaskDialog: React.FC<MetamaskDialogProps> = ({
  successMessage, open, error, txn, resetHandler, successHandler
}) => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (txn) {
      setActiveStep(1);
    } else {
      setActiveStep(0);
    }
  }, [txn]);

  useEffect(() => {
    if (activeStep === 1) {
      txn.wait().then(() => {
        setActiveStep(2);
        successHandler?.();
        resetHandler?.();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep]);

  return (
    <>
      <Dialog open={open} disableEscapeKeyDown>
        <DialogContent>
          <Stepper activeStep={activeStep} alternativeLabel>
            <Step>
              <StepLabel>Creating transaction</StepLabel>
            </Step>
            <Step>
              <StepLabel>Waiting for confirmation</StepLabel>
            </Step>
            <Step>
              <StepLabel>Complete</StepLabel>
            </Step>
          </Stepper>
          <Box sx={{ mt: 2, mb: 4 }} />
          {activeStep === 0 && error === undefined && (
            <>
              Waiting for MetaMask confirmation
              <LinearProgress sx={{ mt: 1 }} />
            </>
          )}
          {activeStep === 0 && error !== undefined && (
            <Alert severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          )}
          {activeStep === 1 && error === undefined && (
            <>
              Waiting for transaction to be mined
              <LinearProgress sx={{ mt: 1 }} />
              <TransactionHashCard hash={txn.hash} />
            </>
          )}
          {activeStep === 2 && error === undefined && (
            <>
              {successMessage ?? 'Transaction has been completed.'}
              <TransactionHashCard hash={txn?.hash} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MetamaskDialog;
