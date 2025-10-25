import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = getDb();

    // Insert or update session
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO user_sessions (
        session_id, session_start, device_type, referrer, final_page
      ) VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(
      body.session_id,
      new Date().toISOString(),
      body.device_type || 'desktop',
      body.referrer || '',
      body.page || ''
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating/updating session:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      );
    }

    const db = getDb();
    const session = db.prepare(`
      SELECT * FROM user_sessions WHERE session_id = ?
    `).get(sessionId);

    return NextResponse.json({ session });
  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json(
      { error: 'Failed to fetch session' },
      { status: 500 }
    );
  }
}