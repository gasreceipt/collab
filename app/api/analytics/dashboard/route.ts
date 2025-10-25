import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    // Build date filter
    let dateFilter = '';
    const params: any[] = [];

    if (startDate && endDate) {
      dateFilter = ' AND timestamp BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    // Total sessions
    const totalSessions = db.prepare(`
      SELECT COUNT(*) as count FROM user_sessions
      WHERE 1=1 ${startDate && endDate ? 'AND session_start BETWEEN ? AND ?' : ''}
    `).get(...params) as { count: number };

    // Page views by page
    const pageViews = db.prepare(`
      SELECT page, COUNT(*) as count
      FROM page_views
      WHERE 1=1 ${dateFilter}
      GROUP BY page
    `).all(...params);

    // Conversion stats
    const conversionStats = db.prepare(`
      SELECT conversion_status, COUNT(*) as count
      FROM user_sessions
      WHERE 1=1 ${startDate && endDate ? 'AND session_start BETWEEN ? AND ?' : ''}
      GROUP BY conversion_status
    `).all(...params);

    // Device breakdown
    const deviceStats = db.prepare(`
      SELECT device_type, COUNT(*) as count
      FROM user_sessions
      WHERE 1=1 ${startDate && endDate ? 'AND session_start BETWEEN ? AND ?' : ''}
      GROUP BY device_type
    `).all(...params);

    // Top performing elements (by clicks)
    const topElements = db.prepare(`
      SELECT element_id, element_category, COUNT(*) as clicks
      FROM element_interactions
      WHERE interaction_type = 'click' ${dateFilter}
      GROUP BY element_id, element_category
      ORDER BY clicks DESC
      LIMIT 10
    `).all(...params);

    // Email signups by page
    const emailSignups = db.prepare(`
      SELECT page, COUNT(*) as count
      FROM form_submissions
      WHERE form_type = 'email_signup' ${dateFilter}
      GROUP BY page
    `).all(...params);

    // Product engagement by brand
    const productEngagement = db.prepare(`
      SELECT brand, interaction_type, COUNT(*) as count
      FROM product_engagement
      WHERE 1=1 ${dateFilter}
      GROUP BY brand, interaction_type
    `).all(...params);

    // Average scroll depth by page
    const scrollDepth = db.prepare(`
      SELECT page, AVG(scroll_max_percentage) as avg_scroll
      FROM page_views
      WHERE 1=1 ${dateFilter}
      GROUP BY page
    `).all(...params);

    // Average time on page
    const timeOnPage = db.prepare(`
      SELECT page, AVG(time_on_page) as avg_time
      FROM page_views
      WHERE time_on_page > 0 ${dateFilter}
      GROUP BY page
    `).all(...params);

    // Recent form submissions
    const recentSubmissions = db.prepare(`
      SELECT email, page, form_type, timestamp
      FROM form_submissions
      WHERE 1=1 ${dateFilter}
      ORDER BY timestamp DESC
      LIMIT 20
    `).all(...params);

    // A/B test performance
    const abTestResults = db.prepare(`
      SELECT
        ab_test_variant,
        COUNT(DISTINCT user_session_id) as sessions,
        SUM(CASE WHEN event_type = 'click' AND element_id LIKE '%cta%' THEN 1 ELSE 0 END) as cta_clicks
      FROM analytics_events
      WHERE ab_test_variant IS NOT NULL ${dateFilter}
      GROUP BY ab_test_variant
    `).all(...params);

    // Traffic sources (UTM)
    const trafficSources = db.prepare(`
      SELECT utm_source, COUNT(DISTINCT user_session_id) as sessions
      FROM analytics_events
      WHERE utm_source IS NOT NULL ${dateFilter}
      GROUP BY utm_source
      ORDER BY sessions DESC
      LIMIT 10
    `).all(...params);

    return NextResponse.json({
      totalSessions: totalSessions.count,
      pageViews,
      conversionStats,
      deviceStats,
      topElements,
      emailSignups,
      productEngagement,
      scrollDepth,
      timeOnPage,
      recentSubmissions,
      abTestResults,
      trafficSources,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
