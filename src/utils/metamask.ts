import detectEthereumProvider from '@metamask/detect-provider';

export const login = async () => {
  const provider = await detectEthereumProvider({ silent: true });

  if (provider) {
    return await window.ethereum.request({ method: 'eth_requestAccounts' });
  }
};
