export interface MetamaskDialogProps {
  open: boolean;
  error?: string;
  txn?: any;
  resetHandler?: () => void;
  successHandler?: () => void;
  successMessage?: string;
};
