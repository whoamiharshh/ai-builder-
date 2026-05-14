// Frontend Analytics Setup - src/analytics.ts

export interface AnalyticsEvent {
  name: string;
  parameters?: Record<string, string | number | boolean>;
}

// Initialize Google Analytics
export function initializeAnalytics(measurementId: string) {
  if (!measurementId) {
    console.warn('Google Analytics Measurement ID not configured');
    return;
  }

  // Load Google Analytics script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', measurementId, {
    'anonymize_ip': true,
    'allow_google_signals': true,
    'allow_ad_personalization_signals': true,
  });

  window.gtag = gtag;
}

// Track page views
export function trackPageView(path: string, title: string) {
  if (!window.gtag) return;
  
  const measurementId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
  if (!measurementId) return;
  
  window.gtag('config', measurementId, {
    'page_path': path,
    'page_title': title,
  });
}

// Track custom events
export function trackEvent(eventName: string, parameters?: Record<string, any>) {
  if (!window.gtag) return;

  window.gtag('event', eventName, {
    ...parameters,
    timestamp: new Date().toISOString(),
  });
}

// Track page timing
export function trackTiming(
  category: string,
  variable: string,
  time: number,
  label?: string
) {
  if (!window.gtag) return;

  window.gtag('event', 'page_view', {
    'event_category': category,
    'event_label': label,
    'value': time,
  });
}

// Track user properties
export function setUserProperties(userId: string, email: string, plan?: string) {
  if (!window.gtag) return;

  const measurementId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
  if (!measurementId) return;

  window.gtag('config', measurementId, {
    'user_id': userId,
    'user_properties': {
      'email': email,
      'plan': plan || 'free',
      'registered_date': new Date().toISOString(),
    },
  });
}

// Payment tracking
export function trackPaymentInitiated(planId: string, price: number) {
  trackEvent('begin_checkout', {
    'currency': 'USD',
    'value': price / 100,
    'items': [
      {
        'item_id': planId,
        'item_name': planId.replace('-', ' ').toUpperCase(),
        'price': price / 100,
      },
    ],
  });
}

export function trackPaymentCompleted(
  planId: string,
  price: number,
  sessionId: string
) {
  trackEvent('purchase', {
    'currency': 'USD',
    'transaction_id': sessionId,
    'value': price / 100,
    'items': [
      {
        'item_id': planId,
        'item_name': planId.replace('-', ' ').toUpperCase(),
        'price': price / 100,
      },
    ],
  });
}

export function trackPaymentFailed(planId: string, reason: string) {
  trackEvent('purchase_error', {
    'plan': planId,
    'reason': reason,
  });
}

// Feature usage tracking
export function trackFeatureUsage(feature: string, details?: Record<string, any>) {
  trackEvent('feature_usage', {
    'feature_name': feature,
    ...details,
  });
}

export function trackConceptGeneration(
  conceptCount: number,
  renderCount: number
) {
  trackEvent('concept_generated', {
    'concept_count': conceptCount,
    'render_count': renderCount,
    'timestamp': new Date().toISOString(),
  });
}

export function trackExportAction(format: string, projectCount: number) {
  trackEvent('export_completed', {
    'export_format': format,
    'project_count': projectCount,
  });
}

// Error tracking
export function trackError(errorMessage: string, context?: string) {
  trackEvent('application_error', {
    'error_message': errorMessage,
    'context': context,
    'timestamp': new Date().toISOString(),
  });
}

// Engagement tracking
export function trackEngagementTime(sessionDuration: number) {
  trackEvent('engagement_time', {
    'duration_ms': sessionDuration,
  });
}

// Define global gtag type
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export default {
  initializeAnalytics,
  trackPageView,
  trackEvent,
  trackTiming,
  setUserProperties,
  trackPaymentInitiated,
  trackPaymentCompleted,
  trackPaymentFailed,
  trackFeatureUsage,
  trackConceptGeneration,
  trackExportAction,
  trackError,
  trackEngagementTime,
};
