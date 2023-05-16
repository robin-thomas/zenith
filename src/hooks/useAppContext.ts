import { useContext } from 'react';

import { DataContext } from '@/store/DataProvider';

export const useAppContext = () => useContext(DataContext);
