import { NextRequest, NextResponse } from 'next/server';
import { backupDatabase, cleanOldBackups } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Perform backup
    const backupPath = backupDatabase();

    // Clean old backups (keep last 30 days)
    cleanOldBackups(30);

    return NextResponse.json({
      success: true,
      backupPath,
      message: 'Database backed up successfully',
    });
  } catch (error) {
    console.error('Backup failed:', error);
    return NextResponse.json(
      { error: 'Backup failed', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const fs = require('fs');
    const path = require('path');
    const backupDir = path.join(process.cwd(), 'backups');

    if (!fs.existsSync(backupDir)) {
      return NextResponse.json({ backups: [] });
    }

    const files = fs.readdirSync(backupDir);
    const backups = files.map((file: string) => {
      const filePath = path.join(backupDir, file);
      const stats = fs.statSync(filePath);
      return {
        filename: file,
        size: stats.size,
        created: stats.mtime,
      };
    });

    return NextResponse.json({ backups });
  } catch (error) {
    console.error('Failed to list backups:', error);
    return NextResponse.json(
      { error: 'Failed to list backups' },
      { status: 500 }
    );
  }
}
