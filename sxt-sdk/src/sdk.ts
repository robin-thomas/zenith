import AuthSDK from './auth';

import type { QueryOptions, BaseSDKOptions } from './sdk.types';

class BaseSDK {
  private path: string;
  private authSDK: AuthSDK;

  constructor({ host, path }: BaseSDKOptions) {
    this.path = path;
    this.authSDK = new AuthSDK({ host });
  }

  async query(sqlText: string, options: QueryOptions) {
    const { userId, privateKey, publicKey, ...queryOptions } = options;
    await this.authSDK.login({ userId, privateKey, publicKey });

    const _sqlText = sqlText.trim()
      .replace(/\n/gm, '')
      .replace(/\"/gm, '\"')
      .replace(/  +/g, ' ')
    ;

    const res = await fetch(`${this.authSDK.host}${this.path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.authSDK.accessToken}`,
        ...queryOptions.biscuit && { biscuit: queryOptions.biscuit },
      },
      body: JSON.stringify({
        sqlText: _sqlText,
        ...queryOptions.resourceId && { resourceId: queryOptions.resourceId },
      }),
    });

    const data = await res.text();

    try {
      JSON.parse(data);
    } catch (err) {
      throw new Error(`Failed to execute query: ${res.status} ${res.statusText}`);
    }

    const json = JSON.parse(data);

    if (!res.ok) {
      throw new Error(json.title ?? `Failed to execute query: ${res.status} ${res.statusText}`);
    }

    return json;
  }
}

export default BaseSDK;
