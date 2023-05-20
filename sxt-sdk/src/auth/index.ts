import { getAuthCode, getSignature, getAccessToken, refreshAccessToken } from './authenticate';

import type { SDKOptions } from '../index.types';
import type { AuthLoginOptions } from './index.types';
import type { ReturnAccessToken } from './authenticate.types';

class AuthSDK {
  public host: string;
  public accessToken: string | undefined;
  private refreshToken: string | undefined;
  private accessTokenExpires: number | undefined;
  private refreshTokenExpires: number | undefined;

  constructor({ host }: SDKOptions) {
    this.host = host;
  }

  async login({ userId, privateKey, publicKey }: AuthLoginOptions) {
    if (!this.accessToken) {
      return this.loadAccessToken({ userId, privateKey, publicKey });
    } else if (Date.now() >= (this.accessTokenExpires as number)) {
      if (Date.now() >= (this.refreshTokenExpires as number)) {
        return this.loadAccessToken({ userId, privateKey, publicKey });
      } else {
        const data = await refreshAccessToken({
          host: this.host,
          refreshToken: this.refreshToken as string,
        });
        this.loadCredentials(data);
      }
    }
  }

  private async loadAccessToken({ userId, privateKey, publicKey }: AuthLoginOptions) {
    const authCode = await getAuthCode({ host: this.host, userId });
    const signature = getSignature({ authCode, privateKey });

    const data = await getAccessToken({ host: this.host, userId, authCode, signature, publicKey });
    this.loadCredentials(data);
  }

  private loadCredentials(data: ReturnAccessToken) {
    this.accessToken = data.accessToken;
    this.refreshToken = data.refreshToken;
    this.accessTokenExpires = data.accessTokenExpires;
    this.refreshTokenExpires = data.refreshTokenExpires;
  }
}

export default AuthSDK;
