export type IMetamaskProviderProps = {
  children: React.ReactNode;
};

declare global {
  interface Window {
    ethereum: any;
  }
}
