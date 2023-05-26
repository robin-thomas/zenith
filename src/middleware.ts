import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const { nextUrl: url, geo } = req;

  const country = geo?.country?.toLowerCase() || 'us';
  url.searchParams.set('country', country);

  return NextResponse.rewrite(url);
}
