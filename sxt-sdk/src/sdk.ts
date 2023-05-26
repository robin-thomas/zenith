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

    const url = `${this.authSDK.host}${this.path}`;
    const _options = {
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
    };

    // eslint-disable-next-line no-console
    console.log(`Sending POST request to ${url} with:`, _options);

    const res = await fetch(`${this.authSDK.host}${this.path}`, _options);

    const data = await res.text();

    try {
      JSON.parse(data);
    } catch (err) {
      if (res.ok) {
        return;
      }

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
