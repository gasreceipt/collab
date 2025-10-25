import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = getDb();

    db.prepare(`
      INSERT INTO device_performance (
        session_id, page, page_load_time, dom_interactive_time,
        device_type, browser
      ) VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      body.session_id,
      body.page,
      body.page_load_time,
      body.dom_interactive_time,
      body.device_type,
      body.browser
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording performance:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
