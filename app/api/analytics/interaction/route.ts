import { NextRequest, NextResponse } from 'next/server';
import analyticsDB from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    analyticsDB.insertElementInteraction(body);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording interaction:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
