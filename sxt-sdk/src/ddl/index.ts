import BaseSDK from '../sdk';
import type { DdlSDKOptions } from './index.types';

class DdlSDK extends BaseSDK {
  constructor({ host }: DdlSDKOptions) {
    super({ host, path: '/v1/sql/ddl' });
  }
}

export default DdlSDK;
