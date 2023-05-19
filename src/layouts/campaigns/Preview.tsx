import { useFormikContext } from 'formik';

import { default as PreviewAd } from '@/layouts/ad/Preview';
import type { NewCampaignState } from './NewCampaign.types';
import { PLACEHOLDER_NAME, PLACEHOLDER_DESCRIPTION, PLACEHOLDER_URL } from '@/constants/campaign';

const Preview: React.FC = () => {
  const { values } = useFormikContext<NewCampaignState>();

  return (
    <PreviewAd
      name={values.name || PLACEHOLDER_NAME}
      url={values.url || PLACEHOLDER_URL}
      description={values.description || PLACEHOLDER_DESCRIPTION}
    />
  );
};

export default Preview;
