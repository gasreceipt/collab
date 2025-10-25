import { NextRequest, NextResponse } from 'next/server';
import analyticsDB, { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Insert form submission
    analyticsDB.insertFormSubmission(body);

    // Update session conversion status
    const db = getDb();
    db.prepare(`
      UPDATE user_sessions
      SET conversion_status = 'email_signup'
      WHERE session_id = ? AND conversion_status = 'none'
    `).run(body.session_id);

    // Track conversion funnel step
    db.prepare(`
      INSERT INTO conversion_funnel (session_id, page, funnel_step, step_order)
      VALUES (?, ?, 'form_submitted', 7)
    `).run(body.session_id, body.page);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording form submission:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
