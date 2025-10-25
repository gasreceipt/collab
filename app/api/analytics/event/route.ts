import { NextRequest, NextResponse } from 'next/server';
import analyticsDB from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { events, session_id } = body;

    if (!events || !Array.isArray(events) || !session_id) {
      return NextResponse.json(
        { error: 'Invalid request: events array and session_id required' },
        { status: 400 }
      );
    }

    // Create or update session
    const firstEvent = events[0];
    if (firstEvent) {
      analyticsDB.upsertSession({
        session_id,
        device_type: firstEvent.user_device,
        referrer: firstEvent.referrer,
      });
    }

    // Insert all events
    for (const event of events) {
      try {
        analyticsDB.insertEvent({
          ...event,
          user_session_id: session_id,
        });
      } catch (err) {
        console.error('Failed to insert event:', err);
      }
    }

    return NextResponse.json({
      success: true,
      recorded: events.length,
    });
  } catch (error) {
    console.error('Error processing analytics events:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
