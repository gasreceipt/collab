// Client-Side Event Tracking Library for vSMPL Analytics
// Handles session management, event batching, and offline queuing

import { v4 as uuidv4 } from 'uuid';

export type PageType = 'hub' | 'uniformish' | 'catnip' | 'bad-arctic';
export type EventType = 'page_view' | 'click' | 'scroll' | 'hover' | 'form_input' | 'video_play' | 'image_view';
export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type Variant = 'control' | 'variant_a' | 'variant_b';

export interface TrackingEvent {
  timestamp: string;
  page: PageType;
  event_type: EventType;
  element_id?: string;
  element_text?: string;
  user_session_id: string;
  user_device?: DeviceType;
  user_viewport?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  url_path?: string;
  ab_test_variant?: Variant;
}

export interface EventBatch {
  events: TrackingEvent[];
  session_id: string;
}

class AnalyticsTracker {
  private sessionId: string;
  private eventQueue: TrackingEvent[] = [];
  private batchInterval: number = 10000; // 10 seconds
  private batchTimer: NodeJS.Timeout | null = null;
  private isOnline: boolean = true;
  private pageLoadTime: number = Date.now();
  private currentPage: PageType | null = null;
  private scrollDepth: number = 0;
  private maxScrollDepth: number = 0;

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.initializeTracking();
  }

  // Get or create session ID
  private getOrCreateSessionId(): string {
    if (typeof window === 'undefined') return 'server';

    // Check localStorage
    let sessionId = localStorage.getItem('vsmpl_session_id');

    if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem('vsmpl_session_id', sessionId);

      // Also set cookie for server-side access
      document.cookie = `vsmpl_session_id=${sessionId}; path=/; max-age=2592000`; // 30 days
    }

    return sessionId;
  }

  // Initialize tracking listeners
  private initializeTracking() {
    if (typeof window === 'undefined') return;

    // Start batch timer
    this.startBatchTimer();

    // Online/offline detection
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Send events before page unload
    window.addEventListener('beforeunload', () => {
      this.flushQueue(true);
    });

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.flushQueue(true);
      }
    });

    // Track scroll depth
    let scrollTimeout: NodeJS.Timeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.trackScrollDepth();
      }, 100);
    });

    // Track clicks globally
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      this.trackClick(target);
    });

    // Load offline events from localStorage
    this.loadOfflineEvents();
  }

  // Detect device type
  private getDeviceType(): DeviceType {
    if (typeof window === 'undefined') return 'desktop';

    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  // Get viewport dimensions
  private getViewport(): string {
    if (typeof window === 'undefined') return '0x0';
    return `${window.innerWidth}x${window.innerHeight}`;
  }

  // Extract UTM parameters
  private getUtmParams(): {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
  } {
    if (typeof window === 'undefined') return {};

    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get('utm_source') || undefined,
      utm_medium: params.get('utm_medium') || undefined,
      utm_campaign: params.get('utm_campaign') || undefined,
    };
  }

    // Get current A/B test variant
  private getCurrentVariant(): Variant | undefined {
    if (typeof window === 'undefined') return undefined;

    // Implementation would depend on A/B testing logic
    return undefined;
  }

  // Ensure session exists in database
  private async ensureSession(page: PageType): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      await fetch('/api/analytics/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: this.sessionId,
          device_type: this.getDeviceType(),
          referrer: document.referrer,
          page: page,
        }),
      });
    } catch (error) {
      console.error('Failed to ensure session:', error);
    }
  }

  // Track event
  public track(event: Partial<TrackingEvent>) {
    const fullEvent: TrackingEvent = {
      timestamp: new Date().toISOString(),
      page: this.currentPage || 'hub',
      event_type: event.event_type || 'page_view',
      element_id: event.element_id,
      element_text: event.element_text,
      user_session_id: this.sessionId,
      user_device: this.getDeviceType(),
      user_viewport: this.getViewport(),
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      url_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
      ab_test_variant: this.getCurrentVariant(),
      ...this.getUtmParams(),
      ...event,
    };

    this.eventQueue.push(fullEvent);

    // If queue is large, flush immediately
    if (this.eventQueue.length >= 50) {
      this.flushQueue();
    }
  }

  // Track page view
  public async trackPageView(page: PageType) {
    this.currentPage = page;
    this.pageLoadTime = Date.now();
    this.scrollDepth = 0;
    this.maxScrollDepth = 0;

    // Ensure session exists in database first
    await this.ensureSession(page);

    this.track({
      event_type: 'page_view',
      page,
    });

    // Track performance metrics
    if (typeof window !== 'undefined' && window.performance) {
      const perfData = window.performance.timing;
      const loadTime = perfData.loadEventEnd - perfData.navigationStart;
      const domInteractive = perfData.domInteractive - perfData.navigationStart;

      // Send performance data separately with delay to ensure session exists
      setTimeout(() => {
        fetch('/api/analytics/performance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: this.sessionId,
            page,
            page_load_time: loadTime,
            dom_interactive_time: domInteractive,
            device_type: this.getDeviceType(),
            browser: navigator.userAgent,
          }),
        }).catch(() => {
          // Silently fail
        });
      }, 2000); // Increased delay to 2 seconds
    }
  }

  // Track click
  private trackClick(element: HTMLElement) {
    const elementId = element.id || element.getAttribute('data-track-id');
    const elementText = element.textContent?.trim().slice(0, 100);
    const elementType = this.getElementType(element);
    const elementCategory = this.getElementCategory(element);

    if (elementId || elementType) {
      this.track({
        event_type: 'click',
        element_id: elementId || element.tagName.toLowerCase(),
        element_text: elementText,
      });

      // Send detailed interaction separately with delay to ensure session exists
      setTimeout(() => {
        fetch('/api/analytics/interaction', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: this.sessionId,
            page: this.currentPage,
            element_id: elementId,
            element_type: elementType,
            interaction_type: 'click',
            time_to_interaction: Date.now() - this.pageLoadTime,
            element_category: elementCategory,
            ab_test_variant: this.getCurrentVariant(),
          }),
        }).catch(() => {
          // Silently fail
        });
      }, 500);
    }
  }

  // Get element type
  private getElementType(element: HTMLElement): string | undefined {
    const tag = element.tagName.toLowerCase();
    if (tag === 'button' || element.getAttribute('role') === 'button') return 'button';
    if (tag === 'a') return 'link';
    if (element.classList.contains('product-card')) return 'product_card';
    if (tag === 'input' || tag === 'textarea') return 'form_input';
    if (tag === 'video') return 'video';
    if (tag === 'img') return 'image';
    return undefined;
  }

  // Get element category
  private getElementCategory(element: HTMLElement): string | undefined {
    if (element.classList.contains('hero')) return 'hero';
    if (element.classList.contains('cta')) return 'cta';
    if (element.classList.contains('product')) return 'product';
    if (element.classList.contains('social')) return 'social';
    if (element.classList.contains('email-signup')) return 'email_signup';
    if (element.classList.contains('nav') || element.closest('nav')) return 'navigation';
    return undefined;
  }

  // Track scroll depth
  private trackScrollDepth() {
    if (typeof window === 'undefined') return;

    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;

    const scrollPercentage = Math.round(
      ((scrollTop + windowHeight) / documentHeight) * 100
    );

    this.scrollDepth = scrollPercentage;
    if (scrollPercentage > this.maxScrollDepth) {
      this.maxScrollDepth = scrollPercentage;

      // Track milestone scroll depths
      if (
        this.maxScrollDepth === 25 ||
        this.maxScrollDepth === 50 ||
        this.maxScrollDepth === 75 ||
        this.maxScrollDepth === 100
      ) {
        this.track({
          event_type: 'scroll',
          element_text: `${this.maxScrollDepth}% scroll depth`,
        });

        // Send detailed scroll tracking with delay to ensure session exists
        setTimeout(() => {
          fetch('/api/analytics/scroll', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              session_id: this.sessionId,
              page: this.currentPage,
              scroll_percentage: this.maxScrollDepth,
              scroll_direction: 'down',
            }),
          }).catch(() => {
            // Silently fail
          });
        }, 1000);
      }
    }
  }

  // Track form submission
  public trackFormSubmission(formType: string, email?: string, formData?: any) {
    this.track({
      event_type: 'form_input',
      element_text: `Form submitted: ${formType}`,
    });

    // Send detailed form submission
    fetch('/api/analytics/form-submission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: this.sessionId,
        page: this.currentPage,
        form_type: formType,
        email,
        form_data: JSON.stringify(formData || {}),
        ab_test_variant: this.getCurrentVariant(),
        submission_page: this.currentPage,
        utm_data: JSON.stringify(this.getUtmParams()),
      }),
    }).catch(() => {
      // Silently fail
    });
  }

  // Track product engagement
  public trackProductEngagement(
    productId: string,
    productName: string,
    interactionType: 'view' | 'hover' | 'click' | 'add_to_waitlist'
  ) {
    this.track({
      event_type: interactionType === 'view' ? 'image_view' : 'click',
      element_id: productId,
      element_text: productName,
    });

    // Send detailed product engagement
    fetch('/api/analytics/product-engagement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: this.sessionId,
        page: this.currentPage,
        product_id: productId,
        product_name: productName,
        brand: this.currentPage,
        interaction_type: interactionType,
        time_to_interaction: Date.now() - this.pageLoadTime,
        ab_test_variant: this.getCurrentVariant(),
      }),
    }).catch(() => {
      // Silently fail
    });
  }

  // Flush event queue
  private flushQueue(synchronous: boolean = false) {
    if (this.eventQueue.length === 0) return;

    const batch: EventBatch = {
      events: [...this.eventQueue],
      session_id: this.sessionId,
    };

    this.eventQueue = [];

    if (synchronous && navigator.sendBeacon) {
      // Use sendBeacon for synchronous sending on page unload
      navigator.sendBeacon(
        '/api/analytics/event',
        new Blob([JSON.stringify(batch)], { type: 'application/json' })
      );
    } else {
      // Regular fetch
      fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batch),
        keepalive: true,
      }).catch(() => {
        // If offline, save to localStorage
        if (!this.isOnline) {
          this.saveOfflineEvents(batch.events);
        }
      });
    }
  }

  // Start batch timer
  private startBatchTimer() {
    if (this.batchTimer) return;

    this.batchTimer = setInterval(() => {
      this.flushQueue();
    }, this.batchInterval);
  }

  // Save events offline
  private saveOfflineEvents(events: TrackingEvent[]) {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem('vsmpl_offline_events');
    const existingEvents: TrackingEvent[] = stored ? JSON.parse(stored) : [];
    const combined = [...existingEvents, ...events];

    // Keep only last 500 events
    const trimmed = combined.slice(-500);
    localStorage.setItem('vsmpl_offline_events', JSON.stringify(trimmed));
  }

  // Load offline events
  private loadOfflineEvents() {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem('vsmpl_offline_events');
    if (stored) {
      try {
        const events: TrackingEvent[] = JSON.parse(stored);
        this.eventQueue.push(...events);
        localStorage.removeItem('vsmpl_offline_events');
        this.flushQueue();
      } catch (e) {
        console.error('Failed to load offline events', e);
      }
    }
  }

  // Get session ID
  public getSessionId(): string {
    return this.sessionId;
  }
}

// Singleton instance
let trackerInstance: AnalyticsTracker | null = null;

export function getTracker(): AnalyticsTracker {
  if (!trackerInstance && typeof window !== 'undefined') {
    trackerInstance = new AnalyticsTracker();
  }
  return trackerInstance!;
}

export default getTracker;
