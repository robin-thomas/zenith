export interface TargetingProps {
  targeting: {
    maticBalance: string;
    transactionCount: string;
    walletAge: string;
    enabled: {
      maticBalance: boolean;
      transactionCount: boolean;
      walletAge: boolean;
      nft: boolean;
    }
  }
}
