import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const { searchParams } = url;
  const country = searchParams.get('country') || 'us';
  
  return NextResponse.json({ country });
};
