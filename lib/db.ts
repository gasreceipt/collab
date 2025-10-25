import Database from 'better-sqlite3';
import { readFileSync, existsSync, mkdirSync, copyFileSync } from 'fs';
import { join } from 'path';

const dbPath = join(process.cwd(), 'database', 'analytics.db');
const schemaPath = join(process.cwd(), 'database', 'schema.sql');
const backupDir = join(process.cwd(), 'backups');

// Ensure database and backup directories exist
const dbDir = join(process.cwd(), 'database');
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}
if (!existsSync(backupDir)) {
  mkdirSync(backupDir, { recursive: true });
}

// Initialize database
let db: Database.Database | null = null;
let schemaInitialized = false;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(dbPath, { verbose: console.log });
    db.pragma('journal_mode = WAL'); // Write-Ahead Logging for better performance

    // Initialize schema only if database is new (no tables exist)
    if (!schemaInitialized && existsSync(schemaPath)) {
      try {
        // Check if tables already exist
        const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='analytics_events'").all();
        
        if (tables.length === 0) {
          // Database is empty, initialize schema
          const schema = readFileSync(schemaPath, 'utf-8');
          db.exec(schema);
          console.log('✅ Database schema initialized');
        } else {
          console.log('✅ Database schema already exists');
        }
        schemaInitialized = true;
      } catch (error) {
        console.error('Error checking/initializing database schema:', error);
      }
    }
  }
  return db;
}

// Backup database
export function backupDatabase(): string {
  const db = getDb();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = join(backupDir, `analytics_${timestamp}.db`);

  try {
    db.backup(backupPath);
    console.log(`✅ Database backed up to: ${backupPath}`);
    return backupPath;
  } catch (error) {
    console.error('❌ Database backup failed:', error);
    throw error;
  }
}

// Clean old backups (keep last 30 days)
export function cleanOldBackups(daysToKeep: number = 30): void {
  const fs = require('fs');
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  if (!existsSync(backupDir)) return;

  const files = fs.readdirSync(backupDir);
  files.forEach((file: string) => {
    const filePath = join(backupDir, file);
    const stats = fs.statSync(filePath);

    if (stats.mtime < cutoffDate) {
      fs.unlinkSync(filePath);
      console.log(`🗑️  Deleted old backup: ${file}`);
    }
  });
}

// Database helper types
export interface AnalyticsEvent {
  timestamp?: string;
  page: 'hub' | 'uniformish' | 'catnip' | 'bad-arctic';
  event_type: 'page_view' | 'click' | 'scroll' | 'hover' | 'form_input' | 'video_play' | 'image_view';
  element_id?: string;
  element_text?: string;
  user_session_id: string;
  user_device?: 'mobile' | 'tablet' | 'desktop';
  user_viewport?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  url_path?: string;
  ab_test_variant?: 'control' | 'variant_a' | 'variant_b';
}

export interface UserSession {
  session_id: string;
  session_start?: string;
  session_end?: string;
  total_duration?: number;
  page_entries?: string;
  device_type?: 'mobile' | 'tablet' | 'desktop';
  referrer?: string;
  conversion_status?: 'none' | 'email_signup' | 'product_interest' | 'checkout_initiated';
  final_page?: string;
}

export interface PageView {
  session_id: string;
  page: string;
  timestamp?: string;
  time_on_page?: number;
  scroll_depth?: number;
  scroll_max_percentage?: number;
  scroll_events_count?: number;
  bounce?: boolean;
  exit_element?: string;
}

export interface ElementInteraction {
  session_id: string;
  page: string;
  timestamp?: string;
  element_id: string;
  element_type?: 'button' | 'link' | 'product_card' | 'form_input' | 'video' | 'image';
  interaction_type?: 'click' | 'hover' | 'focus' | 'play' | 'view';
  time_to_interaction?: number;
  ab_test_variant?: 'control' | 'variant_a' | 'variant_b';
  element_category?: 'hero' | 'cta' | 'product' | 'social' | 'email_signup' | 'navigation';
}

export interface FormSubmission {
  session_id: string;
  page: string;
  timestamp?: string;
  form_type: 'email_signup' | 'waitlist' | 'product_interest' | 'contact';
  email?: string;
  form_data?: string;
  ab_test_variant?: 'control' | 'variant_a' | 'variant_b';
  submission_page?: string;
  utm_data?: string;
}

export interface ProductEngagement {
  session_id: string;
  page: string;
  product_id: string;
  product_name?: string;
  product_price?: number;
  brand?: 'uniformish' | 'catnip' | 'bad-arctic';
  timestamp?: string;
  interaction_type?: 'view' | 'hover' | 'click' | 'add_to_waitlist';
  time_to_interaction?: number;
  time_viewing_product?: number;
  ab_test_variant?: 'control' | 'variant_a' | 'variant_b';
}

export interface ScrollTracking {
  session_id: string;
  page: string;
  timestamp?: string;
  scroll_percentage: number;
  scroll_direction?: 'down' | 'up';
  time_on_section?: number;
  section_name?: string;
}

export interface ConversionFunnel {
  session_id: string;
  timestamp?: string;
  page: string;
  funnel_step: 'initial_view' | 'hero_engagement' | 'product_exploration' | 'cta_click' | 'form_focus' | 'email_entered' | 'form_submitted';
  step_order: number;
  time_between_steps?: number;
}

export interface DevicePerformance {
  session_id: string;
  page: string;
  timestamp?: string;
  page_load_time?: number;
  dom_interactive_time?: number;
  first_contentful_paint?: number;
  device_type?: 'mobile' | 'tablet' | 'desktop';
  browser?: string;
  connection_speed?: '4g' | '3g' | 'slow-2g' | 'unknown';
}

// Helper functions for common operations
export class AnalyticsDB {
  private db: Database.Database;

  constructor() {
    this.db = getDb();
  }

  // Insert analytics event
  insertEvent(event: AnalyticsEvent) {
    const stmt = this.db.prepare(`
      INSERT INTO analytics_events (
        page, event_type, element_id, element_text, user_session_id,
        user_device, user_viewport, referrer, utm_source, utm_medium,
        utm_campaign, url_path, ab_test_variant
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    return stmt.run(
      event.page,
      event.event_type,
      event.element_id,
      event.element_text,
      event.user_session_id,
      event.user_device,
      event.user_viewport,
      event.referrer,
      event.utm_source,
      event.utm_medium,
      event.utm_campaign,
      event.url_path,
      event.ab_test_variant
    );
  }

  // Create or update session
  upsertSession(session: UserSession) {
    const stmt = this.db.prepare(`
      INSERT INTO user_sessions (
        session_id, device_type, referrer, conversion_status
      ) VALUES (?, ?, ?, ?)
      ON CONFLICT(session_id) DO UPDATE SET
        session_end = CURRENT_TIMESTAMP,
        total_duration = (
          CAST((julianday(CURRENT_TIMESTAMP) - julianday(session_start)) * 86400 AS INTEGER)
        ),
        conversion_status = COALESCE(?, conversion_status),
        final_page = COALESCE(?, final_page)
    `);

    return stmt.run(
      session.session_id,
      session.device_type,
      session.referrer,
      session.conversion_status || 'none',
      session.conversion_status,
      session.final_page
    );
  }

  // Insert page view
  insertPageView(pageView: PageView) {
    const stmt = this.db.prepare(`
      INSERT INTO page_views (
        session_id, page, time_on_page, scroll_depth, scroll_max_percentage,
        scroll_events_count, bounce, exit_element
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    return stmt.run(
      pageView.session_id,
      pageView.page,
      pageView.time_on_page || 0,
      pageView.scroll_depth || 0,
      pageView.scroll_max_percentage || 0,
      pageView.scroll_events_count || 0,
      pageView.bounce ? 1 : 0,
      pageView.exit_element
    );
  }

  // Insert element interaction
  insertElementInteraction(interaction: ElementInteraction) {
    const stmt = this.db.prepare(`
      INSERT INTO element_interactions (
        session_id, page, element_id, element_type, interaction_type,
        time_to_interaction, ab_test_variant, element_category
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    return stmt.run(
      interaction.session_id,
      interaction.page,
      interaction.element_id,
      interaction.element_type,
      interaction.interaction_type,
      interaction.time_to_interaction,
      interaction.ab_test_variant,
      interaction.element_category
    );
  }

  // Insert form submission
  insertFormSubmission(submission: FormSubmission) {
    const stmt = this.db.prepare(`
      INSERT INTO form_submissions (
        session_id, page, form_type, email, form_data, ab_test_variant,
        submission_page, utm_data
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    return stmt.run(
      submission.session_id,
      submission.page,
      submission.form_type,
      submission.email,
      submission.form_data || '{}',
      submission.ab_test_variant,
      submission.submission_page,
      submission.utm_data || '{}'
    );
  }

  // Insert product engagement
  insertProductEngagement(engagement: ProductEngagement) {
    const stmt = this.db.prepare(`
      INSERT INTO product_engagement (
        session_id, page, product_id, product_name, product_price, brand,
        interaction_type, time_to_interaction, time_viewing_product, ab_test_variant
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    return stmt.run(
      engagement.session_id,
      engagement.page,
      engagement.product_id,
      engagement.product_name,
      engagement.product_price,
      engagement.brand,
      engagement.interaction_type,
      engagement.time_to_interaction,
      engagement.time_viewing_product || 0,
      engagement.ab_test_variant
    );
  }

  // Get active A/B tests
  getActiveABTests(page?: string) {
    let query = 'SELECT * FROM ab_test_variants WHERE active = 1';
    if (page) {
      query += ' AND page = ?';
      return this.db.prepare(query).all(page);
    }
    return this.db.prepare(query).all();
  }

  // Get session
  getSession(sessionId: string) {
    return this.db.prepare('SELECT * FROM user_sessions WHERE session_id = ?').get(sessionId);
  }
}

export default new AnalyticsDB();
