export interface GetAuthCode {
  host: string;
  userId: string;
}

export interface GetAccessToken extends GetAuthCode {
  authCode: string;
  signature: string;
  publicKey: string;
}

export interface GetSignature {
  authCode: string;
  privateKey: string;
}

export interface RefreshAccessToken {
  host: string;
  refreshToken: string;
}

export interface ReturnAccessToken {
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number;
  refreshTokenExpires: number;
}
