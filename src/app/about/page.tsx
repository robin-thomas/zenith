'use client';

import Stack from '@mui/material/Stack';

import { Logo } from '@/layouts/typography';

const About: React.FC = () => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Logo />
    </Stack>
  );
};

export default About;
