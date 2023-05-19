import { useState } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import InputAdornment from '@mui/material/InputAdornment';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import { Formik } from 'formik';
import { object as YupObject, string as YupString, number as YupNumber, date as YupDate } from 'yup';
import dayjs from 'dayjs';

import Payment from '@/layouts/campaigns/Payment';
import CampaignEnd from '@/layouts/campaigns/CampaignEnd';
import NewCampaignActions from '@/layouts/campaigns/NewCampaignActions';
import Preview from '@/layouts/campaigns/Preview';
import TextInput from '@/layouts/campaigns/TextInput';
import { PLACEHOLDER_NAME, PLACEHOLDER_DESCRIPTION, PLACEHOLDER_URL } from '@/constants/campaign';
import { CURRENCY_SYMBOL, CURRENCY_NAME } from '@/constants/app';

const validationSchema = YupObject({
  name: YupString(),
  description: YupString(),
  url: YupString().url(),
  budget: YupNumber().min(0.1, `Atleast 0.1 ${CURRENCY_NAME}`).required('Required'),
  costPerClick: YupNumber().min(0.001, `Atleast 0.001 ${CURRENCY_NAME}`).required('Required'),
  endDate: YupDate().min(dayjs().add(1, 'day').startOf('day'), 'Should be atleast tomorrow').required('Required'),
});

const NewCampaign: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

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
              <>
                Fill in the details about your campaign.
              </>
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
            <StepLabel>Confirmation</StepLabel>
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
