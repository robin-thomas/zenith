import BaseSDK from '../sdk';
import type { DmlSDKOptions } from './index.types';

class DmlSDK extends BaseSDK {
  constructor({ host }: DmlSDKOptions) {
    super({ host, path: '/v1/sql/dml' });
  }
}

export default DmlSDK;
