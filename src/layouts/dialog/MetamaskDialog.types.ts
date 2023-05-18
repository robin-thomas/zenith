export interface MetamaskDialogProps {
  open: boolean;
  error?: string;
  txn?: any;
  reset?: () => void;
};
