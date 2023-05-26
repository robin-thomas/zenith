import Link from 'next/link';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import styles from './TransactionHash.module.css';

const TransactionHash = ({ hash }: { hash: string }) => (
  <Card variant="outlined" sx={{ mt: 3 }}>
    <CardContent>
      <span className={styles.txnHash}>Transaction Hash</span><br />
      <Link
        href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER}/tx/${hash}`}
        className={styles.hashLink}
        target="_blank"
      >
        {hash}
      </Link>
    </CardContent>
  </Card>
);

export default TransactionHash;
