import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = getDb();

    db.prepare(`
      INSERT INTO scroll_tracking (session_id, page, scroll_percentage, scroll_direction)
      VALUES (?, ?, ?, ?)
    `).run(
      body.session_id,
      body.page,
      body.scroll_percentage,
      body.scroll_direction
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording scroll:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
