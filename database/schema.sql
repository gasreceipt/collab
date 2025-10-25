-- vSMPL Analytics Database Schema
-- SQLite database for comprehensive user tracking and A/B testing

-- Table 1: Analytics Events - Main event log for all user interactions
CREATE TABLE IF NOT EXISTS analytics_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    page TEXT NOT NULL CHECK(page IN ('hub', 'uniformish', 'catnip', 'bad-arctic')),
    event_type TEXT NOT NULL CHECK(event_type IN ('page_view', 'click', 'scroll', 'hover', 'form_input', 'video_play', 'image_view')),
    element_id TEXT,
    element_text TEXT,
    user_session_id TEXT NOT NULL,
    user_device TEXT CHECK(user_device IN ('mobile', 'tablet', 'desktop')),
    user_viewport TEXT,
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    url_path TEXT,
    ab_test_variant TEXT CHECK(ab_test_variant IN ('control', 'variant_a', 'variant_b') OR ab_test_variant IS NULL)
);

CREATE INDEX idx_analytics_events_session ON analytics_events(user_session_id);
CREATE INDEX idx_analytics_events_page ON analytics_events(page);
CREATE INDEX idx_analytics_events_timestamp ON analytics_events(timestamp);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);

-- Table 2: User Sessions - Session-level tracking
CREATE TABLE IF NOT EXISTS user_sessions (
    session_id TEXT PRIMARY KEY,
    session_start DATETIME DEFAULT CURRENT_TIMESTAMP,
    session_end DATETIME,
    total_duration INTEGER DEFAULT 0,
    page_entries TEXT DEFAULT '[]',
    device_type TEXT CHECK(device_type IN ('mobile', 'tablet', 'desktop')),
    referrer TEXT,
    conversion_status TEXT DEFAULT 'none' CHECK(conversion_status IN ('none', 'email_signup', 'product_interest', 'checkout_initiated')),
    final_page TEXT
);

CREATE INDEX idx_user_sessions_start ON user_sessions(session_start);
CREATE INDEX idx_user_sessions_conversion ON user_sessions(conversion_status);

-- Table 3: Page Views - Detailed page view tracking
CREATE TABLE IF NOT EXISTS page_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    page TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    time_on_page INTEGER DEFAULT 0,
    scroll_depth REAL DEFAULT 0 CHECK(scroll_depth >= 0 AND scroll_depth <= 100),
    scroll_max_percentage REAL DEFAULT 0 CHECK(scroll_max_percentage >= 0 AND scroll_max_percentage <= 100),
    scroll_events_count INTEGER DEFAULT 0,
    bounce BOOLEAN DEFAULT 0,
    exit_element TEXT,
    FOREIGN KEY (session_id) REFERENCES user_sessions(session_id)
);

CREATE INDEX idx_page_views_session ON page_views(session_id);
CREATE INDEX idx_page_views_page ON page_views(page);
CREATE INDEX idx_page_views_timestamp ON page_views(timestamp);

-- Table 4: Element Interactions - Track all element-level interactions
CREATE TABLE IF NOT EXISTS element_interactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    page TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    element_id TEXT NOT NULL,
    element_type TEXT CHECK(element_type IN ('button', 'link', 'product_card', 'form_input', 'video', 'image')),
    interaction_type TEXT CHECK(interaction_type IN ('click', 'hover', 'focus', 'play', 'view')),
    time_to_interaction INTEGER,
    ab_test_variant TEXT CHECK(ab_test_variant IN ('control', 'variant_a', 'variant_b') OR ab_test_variant IS NULL),
    element_category TEXT CHECK(element_category IN ('hero', 'cta', 'product', 'social', 'email_signup', 'navigation')),
    FOREIGN KEY (session_id) REFERENCES user_sessions(session_id)
);

CREATE INDEX idx_element_interactions_session ON element_interactions(session_id);
CREATE INDEX idx_element_interactions_element ON element_interactions(element_id);
CREATE INDEX idx_element_interactions_page ON element_interactions(page);

-- Table 5: Form Submissions - Track all form submissions
CREATE TABLE IF NOT EXISTS form_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    page TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    form_type TEXT CHECK(form_type IN ('email_signup', 'waitlist', 'product_interest', 'contact')),
    email TEXT,
    form_data TEXT DEFAULT '{}',
    ab_test_variant TEXT CHECK(ab_test_variant IN ('control', 'variant_a', 'variant_b') OR ab_test_variant IS NULL),
    submission_page TEXT,
    utm_data TEXT DEFAULT '{}',
    FOREIGN KEY (session_id) REFERENCES user_sessions(session_id)
);

CREATE INDEX idx_form_submissions_session ON form_submissions(session_id);
CREATE INDEX idx_form_submissions_email ON form_submissions(email);
CREATE INDEX idx_form_submissions_type ON form_submissions(form_type);

-- Table 6: Product Engagement - Track product-specific interactions
CREATE TABLE IF NOT EXISTS product_engagement (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    page TEXT NOT NULL,
    product_id TEXT NOT NULL,
    product_name TEXT,
    product_price REAL,
    brand TEXT CHECK(brand IN ('uniformish', 'catnip', 'bad-arctic')),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    interaction_type TEXT CHECK(interaction_type IN ('view', 'hover', 'click', 'add_to_waitlist')),
    time_to_interaction INTEGER,
    time_viewing_product INTEGER DEFAULT 0,
    ab_test_variant TEXT CHECK(ab_test_variant IN ('control', 'variant_a', 'variant_b') OR ab_test_variant IS NULL),
    FOREIGN KEY (session_id) REFERENCES user_sessions(session_id)
);

CREATE INDEX idx_product_engagement_session ON product_engagement(session_id);
CREATE INDEX idx_product_engagement_product ON product_engagement(product_id);
CREATE INDEX idx_product_engagement_brand ON product_engagement(brand);

-- Table 7: Scroll Tracking - Detailed scroll behavior tracking
CREATE TABLE IF NOT EXISTS scroll_tracking (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    page TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    scroll_percentage REAL CHECK(scroll_percentage >= 0 AND scroll_percentage <= 100),
    scroll_direction TEXT CHECK(scroll_direction IN ('down', 'up')),
    time_on_section INTEGER DEFAULT 0,
    section_name TEXT,
    FOREIGN KEY (session_id) REFERENCES user_sessions(session_id)
);

CREATE INDEX idx_scroll_tracking_session ON scroll_tracking(session_id);
CREATE INDEX idx_scroll_tracking_page ON scroll_tracking(page);

-- Table 8: A/B Test Variants - Configuration for A/B tests
CREATE TABLE IF NOT EXISTS ab_test_variants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_name TEXT NOT NULL UNIQUE,
    page TEXT NOT NULL,
    variant_type TEXT CHECK(variant_type IN ('hero_headline', 'cta_copy', 'cta_color', 'product_layout', 'pricing_display', 'hero_image')),
    variant_a TEXT,
    variant_b TEXT,
    control TEXT,
    split_percentage REAL DEFAULT 50.0 CHECK(split_percentage >= 0 AND split_percentage <= 100),
    start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    end_date DATETIME,
    active BOOLEAN DEFAULT 1,
    notes TEXT
);

CREATE INDEX idx_ab_test_variants_page ON ab_test_variants(page);
CREATE INDEX idx_ab_test_variants_active ON ab_test_variants(active);

-- Table 9: Conversion Funnel - Track conversion funnel steps
CREATE TABLE IF NOT EXISTS conversion_funnel (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    page TEXT NOT NULL,
    funnel_step TEXT CHECK(funnel_step IN ('initial_view', 'hero_engagement', 'product_exploration', 'cta_click', 'form_focus', 'email_entered', 'form_submitted')),
    step_order INTEGER NOT NULL,
    time_between_steps INTEGER,
    FOREIGN KEY (session_id) REFERENCES user_sessions(session_id)
);

CREATE INDEX idx_conversion_funnel_session ON conversion_funnel(session_id);
CREATE INDEX idx_conversion_funnel_page ON conversion_funnel(page);
CREATE INDEX idx_conversion_funnel_step ON conversion_funnel(funnel_step);

-- Table 10: Device Performance - Track performance metrics
CREATE TABLE IF NOT EXISTS device_performance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    page TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    page_load_time INTEGER,
    dom_interactive_time INTEGER,
    first_contentful_paint INTEGER,
    device_type TEXT CHECK(device_type IN ('mobile', 'tablet', 'desktop')),
    browser TEXT,
    connection_speed TEXT CHECK(connection_speed IN ('4g', '3g', 'slow-2g', 'unknown')),
    FOREIGN KEY (session_id) REFERENCES user_sessions(session_id)
);

CREATE INDEX idx_device_performance_session ON device_performance(session_id);
CREATE INDEX idx_device_performance_device ON device_performance(device_type);

-- Insert default A/B tests
INSERT OR IGNORE INTO ab_test_variants (test_name, page, variant_type, control, variant_a, variant_b, active) VALUES
    ('hub_hero_copy', 'hub', 'hero_headline', 'The vSMPL Ecosystem', 'Three Brands, One Philosophy', NULL, 1),
    ('hub_cta_color', 'hub', 'cta_color', 'brand-accent', 'contrasting', NULL, 1),
    ('uniformish_hero_image', 'uniformish', 'hero_image', 'flat-lay', 'lifestyle', NULL, 1),
    ('uniformish_email_placement', 'uniformish', 'cta_copy', 'hero', 'bottom', NULL, 1),
    ('catnip_hero_video', 'catnip', 'hero_image', 'static', 'autoplay', NULL, 1),
    ('catnip_deck_layout', 'catnip', 'product_layout', 'grid', 'carousel', NULL, 1),
    ('badArctic_pricing', 'bad-arctic', 'pricing_display', 'per-piece', 'price-range', NULL, 1),
    ('badArctic_cta', 'bad-arctic', 'cta_copy', 'commission', 'waitlist', NULL, 1);
