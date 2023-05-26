export const getHumanError = (err: Error) => {
  if (err.message.includes('ACTION_REJECTED')) {
    return 'You have cancelled the transaction!';
  }

  return err.message;
};

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
