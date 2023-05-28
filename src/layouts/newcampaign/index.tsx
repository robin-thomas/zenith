import { useState, useEffect } from 'react';

import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Unstable_Grid2';
import InputAdornment from '@mui/material/InputAdornment';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import LoadingButton from '@mui/lab/LoadingButton';
import { Formik } from 'formik';
import { object as YupObject, string as YupString, number as YupNumber, date as YupDate } from 'yup';
import dayjs from 'dayjs';
import Alert from '@mui/material/Alert';

import Payment from '@/layouts/newcampaign/payment/Payment';
import CampaignEnd from '@/layouts/newcampaign/CampaignEnd';
import NewCampaignActions from '@/layouts/newcampaign/actions/NewCampaignActions';
import Preview from '@/layouts/newcampaign/Preview';
import TextInput from '@/layouts/newcampaign/textinput/TextInput';
import { PLACEHOLDER_NAME, PLACEHOLDER_DESCRIPTION, PLACEHOLDER_URL } from '@/constants/campaign';
import { CURRENCY_SYMBOL, CURRENCY_NAME } from '@/constants/app';
import { useAppContext } from '@/hooks/useAppContext';
import Link from 'next/link';

const validationSchema = YupObject({
  name: YupString(),
  description: YupString(),
  url: YupString().url(),
  budget: YupNumber().min(0.1, `Atleast 0.1 ${CURRENCY_NAME}`).required('Required'),
  costPerClick: YupNumber().min(0.001, `Atleast 0.001 ${CURRENCY_NAME}`).required('Required'),
  endDate: YupDate().min(dayjs().add(1, 'day').startOf('day'), 'Should be atleast tomorrow').required('Required'),
});

const NewCampaign: React.FC = () => {
  const [score, setScore] = useState<number>();
  const [activeStep, setActiveStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const { wallet } = useAppContext();

  useEffect(() => {
    const fn = async () => {
      const resp = await fetch(`/api/passport/score/${wallet.accounts[0]}`);
      const data = await resp.json();

      setScore(data?.score ?? null);
    };

    if (wallet && score === undefined) {
      fn();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet, score]);

  const onSubmitPassport = async () => {
    setSubmitting(true);

    const passportResp = await fetch('/api/passport', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: wallet.accounts[0],
      }),
    });

    await passportResp.json();

    setTimeout(() => {
      setSubmitting(false);
      setScore(undefined);
    }, 1000);
  };

  return (
    <Formik
      initialValues={{
        name: '',
        description: '',
        url: '',
        budget: '',
        costPerClick: '',
        endDate: null,
      }}
      validationSchema={validationSchema}
      onSubmit={() => {
        setActiveStep(index => index + 1);
      }}
    >
      <>
        <Stepper activeStep={activeStep} orientation="vertical">
          <Step>
            <StepLabel>Details</StepLabel>
            <StepContent>
              <Tooltip title="Higher your trust score, better your chances at winning the bidding auction" arrow>
                <Alert
                  severity="info"
                  variant="outlined"
                  action={(
                    <LoadingButton
                      size="small"
                      variant="contained"
                      loading={submitting}
                      onClick={onSubmitPassport}
                    >
                      Recheck Score
                    </LoadingButton>
                  )}
                >
                  Your <i>Gitcoin Passport</i> Score: <b>{score}</b>.
                  Increase your score by adding more stamps at:&nbsp;
                  <Link href="https://passport.gitcoin.co/#/dashboard" target="_blank">
                    Gitcoin Passport
                  </Link>
                </Alert>
              </Tooltip>
              <TextInput id="name" label="Campaign Name" placeholder={PLACEHOLDER_NAME} />
              <TextInput id="description" rows={2} label="Campaign Description" placeholder={PLACEHOLDER_DESCRIPTION} />
              <Grid container spacing={2}>
                <Grid md={4}>
                  <TextInput
                    type="number"
                    id="budget"
                    label="Budget"
                    description={`Budget for this campaign in ${CURRENCY_NAME}s (${CURRENCY_SYMBOL})`}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">{CURRENCY_SYMBOL}</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid md={4}>
                  <TextInput
                    id="costPerClick"
                    label="Cost per click"
                    type="number"
                    description="Base cost per click. This will adjusted based on trufflation rate and PPP index."
                    InputProps={{
                      startAdornment: <InputAdornment position="start">{CURRENCY_SYMBOL}</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid md={4}>
                  <CampaignEnd />
                </Grid>
              </Grid>
              <TextInput
                id="url"
                label="Campaign URL"
                placeholder={PLACEHOLDER_URL}
                description="Users will be redirected here on clicking the ad"
              />
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Preview</StepLabel>
            <StepContent>
              <Preview />
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Payment</StepLabel>
            <StepContent>
              <Payment setActiveStep={setActiveStep} />
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Done</StepLabel>
            <StepContent>
              Your campaign has been created successfully!
            </StepContent>
          </Step>
        </Stepper>
        <NewCampaignActions activeStep={activeStep} setActiveStep={setActiveStep} />
      </>
    </Formik>
  );
};

export default NewCampaign;
