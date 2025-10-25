import { NextRequest, NextResponse } from 'next/server';
import analyticsDB, { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    analyticsDB.insertProductEngagement(body);

    // Update session conversion status if this is a significant interaction
    if (body.interaction_type === 'add_to_waitlist') {
      const db = getDb();
      db.prepare(`
        UPDATE user_sessions
        SET conversion_status = 'product_interest'
        WHERE session_id = ? AND conversion_status = 'none'
      `).run(body.session_id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording product engagement:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
