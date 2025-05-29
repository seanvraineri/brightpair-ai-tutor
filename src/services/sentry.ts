/**
 * Sentry Error Tracking Configuration
 *
 * Only initializes in production environment
 */

import * as Sentry from "@sentry/react";
import { isDevelopment } from "@/utils/env";

export const initSentry = () => {
    // Only initialize Sentry in production
    if (isDevelopment()) {
        console.log("Sentry disabled in development");
        return;
    }

    const sentryDsn = import.meta.env.VITE_SENTRY_DSN;

    if (!sentryDsn) {
        console.warn("Sentry DSN not configured");
        return;
    }

    Sentry.init({
        dsn: sentryDsn,
        environment: import.meta.env.MODE,

        // Performance Monitoring
        tracesSampleRate: 0.1, // 10% of transactions

        // Release tracking
        release: import.meta.env.VITE_APP_VERSION || "unknown",

        // User context
        beforeSend(event, hint) {
            // Filter out non-errors in production
            if (event.exception) {
                const error = hint.originalException;

                // Ignore certain errors
                if (error && typeof error === "object" && "message" in error) {
                    const message = error.message as string;

                    // Ignore network errors that are expected
                    if (
                        message.includes("NetworkError") ||
                        message.includes("Failed to fetch")
                    ) {
                        return null;
                    }

                    // Ignore cancelled requests
                    if (message.includes("AbortError")) {
                        return null;
                    }
                }
            }

            return event;
        },

        // Ignore certain errors
        ignoreErrors: [
            // Browser extensions
            "top.GLOBALS",
            // Random network errors
            "Non-Error promise rejection captured",
            // React errors we handle
            "ResizeObserver loop limit exceeded",
            "ResizeObserver loop completed with undelivered notifications",
        ],
    });
};

// Helper to set user context
export const setSentryUser = (
    user: { id: string; email: string; role?: string },
) => {
    if (isDevelopment()) return;

    Sentry.setUser({
        id: user.id,
        email: user.email,
        role: user.role,
    });
};

// Helper to clear user context
export const clearSentryUser = () => {
    if (isDevelopment()) return;

    Sentry.setUser(null);
};

// Helper to capture custom events
export const captureEvent = (
    message: string,
    level: "info" | "warning" | "error" = "info",
    extra?: Record<string, unknown>,
) => {
    if (isDevelopment()) {
        console.log(`[Sentry ${level}]`, message, extra);
        return;
    }

    Sentry.captureMessage(message, level);

    if (extra) {
        Sentry.setContext("additional_info", extra);
    }
};

// Error boundary component
export const SentryErrorBoundary = Sentry.ErrorBoundary;
