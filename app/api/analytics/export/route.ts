import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';
    const table = searchParams.get('table') || 'analytics_events';
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    // Validate table name
    const validTables = [
      'analytics_events',
      'user_sessions',
      'page_views',
      'element_interactions',
      'form_submissions',
      'product_engagement',
      'scroll_tracking',
      'conversion_funnel',
      'device_performance',
    ];

    if (!validTables.includes(table)) {
      return NextResponse.json(
        { error: 'Invalid table name' },
        { status: 400 }
      );
    }

    // Build query
    let query = `SELECT * FROM ${table}`;
    const params: any[] = [];

    if (startDate && endDate) {
      query += ' WHERE timestamp BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    query += ' ORDER BY timestamp DESC LIMIT 10000';

    const data = db.prepare(query).all(...params);

    if (format === 'csv') {
      // Convert to CSV
      if (data.length === 0) {
        return new NextResponse('No data available', {
          status: 200,
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="${table}_export.csv"`,
          },
        });
      }

      const headers = Object.keys(data[0] as Record<string, any>);
      const csvRows = [headers.join(',')];

      for (const row of data) {
        const values = headers.map((header) => {
          const value = (row as Record<string, any>)[header];
          return `"${String(value).replace(/"/g, '""')}"`;
        });
        csvRows.push(values.join(','));
      }

      const csv = csvRows.join('\n');

      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${table}_export.csv"`,
        },
      });
    } else {
      // Return JSON
      return NextResponse.json(data, {
        headers: {
          'Content-Disposition': `attachment; filename="${table}_export.json"`,
        },
      });
    }
  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
