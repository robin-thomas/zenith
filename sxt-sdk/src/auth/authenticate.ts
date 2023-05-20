import { createPrivateKey, sign } from 'node:crypto';

import type { GetAuthCode, GetAccessToken, GetSignature, RefreshAccessToken, ReturnAccessToken } from './authenticate.types';

export const getAuthCode = async ({ host, userId }: GetAuthCode) => {
  const resp = await fetch(`${host}/v1/auth/code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
    }),
  });

  const data = await resp.json();

  if (!resp.ok) {
    throw new Error(data.title ?? 'Failed to get auth code');
  }

  return data.authCode;
};

export const getAccessToken = async ({ host, userId, authCode, signature, publicKey }: GetAccessToken) => {
  const resp = await fetch(`${host}/v1/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      authCode,
      signature,
      key: publicKey,
      scheme: 'ed25519',
    }),
  });

  const data = await resp.json();

  if (!resp.ok) {
    throw new Error(data.title ?? 'Failed to get access token');
  }

  return data as ReturnAccessToken;
};

export const getSignature = ({ authCode, privateKey }: GetSignature) => {
  const privKey = Buffer.from(privateKey, 'base64');
  const prefix = Buffer.from('302e020100300506032b657004220420', 'hex');
  const pkcs8Der = Buffer.concat([prefix, privKey]);
  const key = createPrivateKey({ key: pkcs8Der, format: 'der', type: 'pkcs8' });

  return sign(null, Buffer.from(authCode), key).toString('hex');
};

export const refreshAccessToken = async ({ host, refreshToken }: RefreshAccessToken) => {
  const resp = await fetch(`${host}/v1/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${refreshToken}`,
    },
  });

  const data = await resp.json();

  if (!resp.ok) {
    throw new Error(data.title ?? 'Failed to refresh access token');
  }

  return data as ReturnAccessToken;
};
