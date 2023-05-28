import { NextResponse } from 'next/server';

import { getPassportScore } from '@/utils/passport';

export async function GET(_: Request, { params }: { params: { address: string } }) {
  try {
    const { address } = params;

    const score = await getPassportScore(address);
    if (score !== undefined) {
      return NextResponse.json({ score }, { status: 200 });
    }

    return NextResponse.json({ error: 'Passport score not found' }, { status: 404 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
