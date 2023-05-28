import { GET_PASSPORT_SCORE_URI } from '@/constants/passport';

export const getPassportScore = async (address: string) => {
  const url = GET_PASSPORT_SCORE_URI
    .replace('{address}', address)
    .replace('{scorer}', process.env.PASSPORT_SCORER as string)
    ;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.PASSPORT_API_KEY}`,
    },
    next: { revalidate: 0 },
  });

  const passportData = await response.json();

  if (passportData?.evidence?.rawScore) {
    return Number.parseFloat(passportData.evidence.rawScore);
  }
};
