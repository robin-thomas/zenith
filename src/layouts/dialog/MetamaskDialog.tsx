import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Poppins } from 'next/font/google';

import LinearProgress from '@mui/material/LinearProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import type { MetamaskDialogProps } from './MetamaskDialog.types';
import styles from './MetamaskDialog.module.css';

const poppins = Poppins({ weight: '600', subsets: ['latin'] });

const MetamaskDialog: React.FC<MetamaskDialogProps> = ({ open, error, txn, reset }) => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (txn) {
      setActiveStep(1);
    }
  }, [txn]);

  useEffect(() => {
    if (activeStep === 1) {
      txn.wait().then(() => {
        setActiveStep(2);
        reset?.();
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
          <Box sx={{ marginTop: 2, marginBottom: 2 }} />
          {activeStep === 0 && error === undefined && (
            <>
              Waiting for MetaMask confirmation
              <LinearProgress sx={{ marginTop: 1 }} />
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
              <LinearProgress sx={{ marginTop: 1 }} />
              <Card variant="outlined" sx={{ marginTop: 3 }}>
                <CardContent>
                  <span className={poppins.className}>Transaction Hash</span><br />
                  <Link href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER}/tx/${txn.hash}`} className={styles.hashLink} target="_blank">
                    {txn.hash}
                  </Link>
                </CardContent>
              </Card>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MetamaskDialog;
