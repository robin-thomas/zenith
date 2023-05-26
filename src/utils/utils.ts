import wc from 'which-country';
import getCountryISO2 from 'country-iso-3-to-2';

export const getHumanError = (err: Error) => {
  if (err.message.includes('ACTION_REJECTED')) {
    return 'You have cancelled the transaction!';
  }

  return err.message;
};

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const getCountry = () => new Promise((resolve, reject) => {
  window.navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const country = getCountryISO2(wc([longitude, latitude]));

      resolve(country);
    },
    () => {
      reject(new Error('Failed to get country'));
    },
    { timeout: 15000 });
});
