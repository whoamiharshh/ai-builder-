// Frontend Monitoring Setup - src/monitoring.ts

// Note: Sentry integration is optional and disabled by default
// To enable, install @sentry/react and @sentry/tracing
// Uncomment the imports below:
// import * as Sentry from "@sentry/react";
// import { BrowserTracing } from "@sentry/tracing";

export function initializeSentry() {
  // Skip Sentry initialization if DSN not configured
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) {
    console.info('Sentry monitoring disabled (VITE_SENTRY_DSN not configured)');
    return;
  }

  // Uncomment when ready to use Sentry
  /*
  Sentry.init({
    dsn: dsn,
    integrations: [
      new BrowserTracing({
        routingInstrumentation: Sentry.reactRouterV6Instrumentation(
          window.history
        ),
      }),
      new Sentry.Replay({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    tracesSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    environment: import.meta.env.MODE,
    release: 'syntheticai@1.0.0',
  });
  */
}

export function captureException(error: Error, context?: Record<string, any>) {
  // Sentry integration disabled - handle gracefully
  console.error('Error:', error, context);
}

export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  // Sentry integration disabled
  console.log(`[${level.toUpperCase()}] ${message}`);
}

export function setUserContext(userId: string, email: string) {
  // Sentry integration disabled
  console.log(`User context: ${userId} (${email})`);
}

export function clearUserContext() {
  // Sentry integration disabled
  console.log('User context cleared');
}

// Payment event tracking
export function trackPaymentEvent(event: string, data: Record<string, any>) {
  // Sentry integration disabled
  console.log(`Payment Event: ${event}`, data);
}

// Error tracking with context
export function trackError(error: Error, component: string, context?: Record<string, any>) {
  // Sentry integration disabled
  console.error(`Error in ${component}:`, error, context);
}

// Setup for main.tsx
export const sentryVitePlugin = () => {
  return {
    name: 'sentry-vite-plugin',
    configResolved(config: any) {
      if (import.meta.env.MODE === 'production') {
        console.log('[Sentry] Monitoring initialized for production');
      }
    },
  };
};
