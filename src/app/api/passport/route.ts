import { NextResponse } from 'next/server';

import { SUBMIT_PASSPORT_URI } from '@/constants/passport';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(SUBMIT_PASSPORT_URI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PASSPORT_API_KEY}`,
      },
      body: JSON.stringify({
        address: body.address,
        community: process.env.PASSPORT_SCORER as string,
        signature: '',
        nonce: '',
      }),
    });

    const signingMessage = await response.json();

    return NextResponse.json(signingMessage, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
