import type { SDKOptions } from './index.types';
import type { AuthLoginOptions } from './auth/index.types';

export interface BaseSDKOptions extends SDKOptions {
  path: string;
}

export interface QueryOptions extends AuthLoginOptions {
  biscuit?: string;
  resourceId?: string;
};
