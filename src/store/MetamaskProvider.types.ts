export type IMetamaskProviderProps = {
  children: React.ReactNode;
};

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    ethereum: any;
  }
}
