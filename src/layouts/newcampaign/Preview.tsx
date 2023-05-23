import { useFormikContext } from 'formik';

import { PreviewCard } from '@/layouts/card';
import type { NewCampaignState } from '@/layouts/newcampaign/index.types';
import { PLACEHOLDER_NAME, PLACEHOLDER_DESCRIPTION, PLACEHOLDER_URL } from '@/constants/campaign';

const Preview: React.FC = () => {
  const { values } = useFormikContext<NewCampaignState>();

  return (
    <PreviewCard
      name={values.name || PLACEHOLDER_NAME}
      url={values.url || PLACEHOLDER_URL}
      description={values.description || PLACEHOLDER_DESCRIPTION}
    />
  );
};

export default Preview;
