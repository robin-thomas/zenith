import BaseSDK from '../sdk';
import type { DqlSDKOptions } from './index.types';

class DqlSDK extends BaseSDK {
  constructor({ host }: DqlSDKOptions) {
    super({ host, path: '/v1/sql/dql' });
  }
}

export default DqlSDK;
