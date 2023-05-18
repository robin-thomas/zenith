import { Poppins } from 'next/font/google';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';

import styles from './Stat.module.css';
import type { StatProps } from './Stat.types';

const poppins = Poppins({ weight: '600', subsets: ['latin'] });

const StatCard: React.FC<StatProps> = ({ icon, title, value, description }) => (
  <Card variant="outlined" className={styles.statsContainer}>
    <CardHeader
      avatar={icon}
      title={(
        <span className={poppins.className}>{title?.toUpperCase()}</span>
      )}
     />
    <CardContent>
      {value !== undefined ? (
        <Tooltip title={description} arrow>
          <span className={poppins.className}>{value}</span>
        </Tooltip>
      ) : <Skeleton variant="rounded" height={50} />}
    </CardContent>
  </Card>
);

export default StatCard;
