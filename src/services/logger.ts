/**
 * Production-ready logging service
 *
 * In production, this would send logs to a service like:
 * - Sentry
 * - LogRocket
 * - DataDog
 * - New Relic
 * etc.
 */

import { isDevelopment } from "@/utils/env";

export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
}

interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: Date;
    data?: unknown;
    error?: Error;
    userId?: string;
    sessionId?: string;
}

// Helper function to get environment info
export const getEnvInfo = () => {
    return {
        isDevelopment: isDevelopment(),
        userAgent: typeof navigator !== "undefined"
            ? navigator.userAgent
            : "Unknown",
        timestamp: new Date().toISOString(),
    };
};

export class Logger {
    private logLevel: LogLevel;
    private isDevelopment: boolean;
    private logBuffer: LogEntry[] = [];
    private maxBufferSize = 100;

    constructor() {
        const env = getEnvInfo();
        this.isDevelopment = env.isDevelopment;
        this.logLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.WARN;
    }

    private shouldLog(level: LogLevel): boolean {
        return level >= this.logLevel;
    }

    private formatMessage(entry: LogEntry): string {
        const timestamp = entry.timestamp.toISOString();
        const level = LogLevel[entry.level];
        return `[${timestamp}] ${level}: ${entry.message}`;
    }

    private sendToService(entry: LogEntry): void {
        // In production, send to logging service
        if (!this.isDevelopment) {
            // Example: Send to remote logging service
            // fetch('/api/logs', {
            //   method: 'POST',
            //   body: JSON.stringify(entry),
            // }).catch(() => {
            //   // Fail silently to not disrupt user experience
            // });
        }
    }

    private log(level: LogLevel, message: string, data?: unknown): void {
        if (!this.shouldLog(level)) return;

        const entry: LogEntry = {
            level,
            message,
            timestamp: new Date(),
            data,
            userId: this.getUserId(),
            sessionId: this.getSessionId(),
        };

        // Add to buffer
        this.logBuffer.push(entry);
        if (this.logBuffer.length > this.maxBufferSize) {
            this.logBuffer.shift();
        }

        // In development, use console
        if (this.isDevelopment) {
            const formattedMessage = this.formatMessage(entry);
            switch (level) {
                case LogLevel.DEBUG:
                    console.debug(formattedMessage, data);
                    break;
                case LogLevel.INFO:
                    console.info(formattedMessage, data);
                    break;
                case LogLevel.WARN:
                    console.warn(formattedMessage, data);
                    break;
                case LogLevel.ERROR:
                    console.error(formattedMessage, data);
                    break;
            }
        }

        // Send to remote service
        this.sendToService(entry);
    }

    private getUserId(): string | undefined {
        // Get from auth context or local storage
        try {
            const user = JSON.parse(
                localStorage.getItem("supabase.auth.token") || "{}",
            );
            return user?.user?.id;
        } catch {
            return undefined;
        }
    }

    private getSessionId(): string {
        // Get or create session ID
        let sessionId = sessionStorage.getItem("sessionId");
        if (!sessionId) {
            sessionId = crypto.randomUUID();
            sessionStorage.setItem("sessionId", sessionId);
        }
        return sessionId;
    }

    debug(message: string, data?: unknown): void {
        this.log(LogLevel.DEBUG, message, data);
    }

    info(message: string, data?: unknown): void {
        this.log(LogLevel.INFO, message, data);
    }

    warn(message: string, data?: unknown): void {
        this.log(LogLevel.WARN, message, data);
    }

    error(message: string, error?: Error | unknown, data?: unknown): void {
        const entry: LogEntry = {
            level: LogLevel.ERROR,
            message,
            timestamp: new Date(),
            data,
            error: error instanceof Error ? error : new Error(String(error)),
            userId: this.getUserId(),
            sessionId: this.getSessionId(),
        };

        // Add to buffer
        this.logBuffer.push(entry);
        if (this.logBuffer.length > this.maxBufferSize) {
            this.logBuffer.shift();
        }

        // In development, use console
        if (this.isDevelopment) {
            console.error(this.formatMessage(entry), error, data);
        }

        // Send to remote service
        this.sendToService(entry);
    }

    // Get recent logs for debugging
    getRecentLogs(): LogEntry[] {
        return [...this.logBuffer];
    }

    // Clear log buffer
    clearLogs(): void {
        this.logBuffer = [];
    }

    // Set log level dynamically
    setLogLevel(level: LogLevel): void {
        this.logLevel = level;
    }
}

// Export singleton instance
export const logger = new Logger();

// Export convenience functions
export const logDebug = (message: string, data?: unknown) =>
    logger.debug(message, data);
export const logInfo = (message: string, data?: unknown) =>
    logger.info(message, data);
export const logWarn = (message: string, data?: unknown) =>
    logger.warn(message, data);
export const logError = (
    message: string,
    error?: Error | unknown,
    data?: unknown,
) => logger.error(message, error, data);
