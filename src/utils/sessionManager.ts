import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/logger";

interface SessionConfig {
    maxIdleTime: number; // Maximum idle time in milliseconds
    refreshThreshold: number; // Time before expiry to refresh token
    checkInterval: number; // How often to check session status
}

interface SessionMetadata {
    lastActivity: number;
    userAgent: string;
    ipAddress?: string;
}

export class SessionManager {
    private static instance: SessionManager | null = null;
    private config: SessionConfig;
    private checkInterval: NodeJS.Timeout | null = null;
    private lastActivityTime: number = Date.now();
    private sessionMetadata: Map<string, SessionMetadata> = new Map();

    private constructor(config?: Partial<SessionConfig>) {
        this.config = {
            maxIdleTime: config?.maxIdleTime || 30 * 60 * 1000, // 30 minutes
            refreshThreshold: config?.refreshThreshold || 5 * 60 * 1000, // 5 minutes
            checkInterval: config?.checkInterval || 60 * 1000, // 1 minute
        };
    }

    public static getInstance(config?: Partial<SessionConfig>): SessionManager {
        if (!SessionManager.instance) {
            SessionManager.instance = new SessionManager(config);
        }
        return SessionManager.instance;
    }

    /**
     * Initialize session monitoring
     */
    public async initialize(): Promise<void> {
        try {
            // Set up activity tracking
            this.setupActivityTracking();

            // Start session monitoring
            this.startSessionMonitoring();

            // Check current session
            await this.checkSession();

            logger.info("Session manager initialized");
        } catch (error) {
            logger.error("Failed to initialize session manager", error);
        }
    }

    /**
     * Set up activity tracking to detect idle sessions
     */
    private setupActivityTracking(): void {
        const updateActivity = () => {
            this.lastActivityTime = Date.now();
        };

        // Track various user activities
        ["mousedown", "keydown", "scroll", "touchstart", "click"].forEach(
            (event) => {
                window.addEventListener(event, updateActivity, {
                    passive: true,
                });
            },
        );

        // Also track visibility changes
        document.addEventListener("visibilitychange", () => {
            if (!document.hidden) {
                updateActivity();
            }
        });
    }

    /**
     * Start monitoring session status
     */
    private startSessionMonitoring(): void {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
        }

        this.checkInterval = setInterval(async () => {
            await this.checkSession();
        }, this.config.checkInterval);
    }

    /**
     * Check session status and handle expiry/refresh
     */
    private async checkSession(): Promise<void> {
        try {
            const { data: { session }, error } = await supabase.auth
                .getSession();

            if (error) {
                logger.error("Error checking session", error);
                return;
            }

            if (!session) {
                this.handleSessionExpired();
                return;
            }

            // Check idle timeout
            const idleTime = Date.now() - this.lastActivityTime;
            if (idleTime > this.config.maxIdleTime) {
                logger.info("Session idle timeout reached");
                await this.signOut();
                return;
            }

            // Check if token needs refresh
            const expiresAt = new Date(session.expires_at!).getTime();
            const timeUntilExpiry = expiresAt - Date.now();

            if (timeUntilExpiry < this.config.refreshThreshold) {
                await this.refreshSession();
            }

            // Update session metadata
            this.updateSessionMetadata(session.user.id);
        } catch (error) {
            logger.error("Session check failed", error);
        }
    }

    /**
     * Refresh the current session
     */
    private async refreshSession(): Promise<void> {
        try {
            const { data, error } = await supabase.auth.refreshSession();

            if (error) {
                logger.error("Failed to refresh session", error);
                this.handleSessionExpired();
                return;
            }

            if (data.session) {
                logger.info("Session refreshed successfully");
            }
        } catch (error) {
            logger.error("Session refresh failed", error);
            this.handleSessionExpired();
        }
    }

    /**
     * Update session metadata
     */
    private updateSessionMetadata(userId: string): void {
        this.sessionMetadata.set(userId, {
            lastActivity: this.lastActivityTime,
            userAgent: navigator.userAgent,
            ipAddress: undefined, // Would need server-side component to get real IP
        });
    }

    /**
     * Handle expired session
     */
    private handleSessionExpired(): void {
        logger.info("Session expired");

        // Clear local storage
        localStorage.removeItem("supabase.auth.token");

        // Redirect to login
        window.location.href = "/login?session_expired=true";
    }

    /**
     * Sign out the current user
     */
    public async signOut(): Promise<void> {
        try {
            const { error } = await supabase.auth.signOut();

            if (error) {
                logger.error("Sign out error", error);
            }

            // Clear session metadata
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                this.sessionMetadata.delete(user.id);
            }

            // Stop monitoring
            this.stopMonitoring();

            // Redirect to login
            window.location.href = "/login";
        } catch (error) {
            logger.error("Failed to sign out", error);
        }
    }

    /**
     * Stop session monitoring
     */
    public stopMonitoring(): void {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    }

    /**
     * Get current session info
     */
    public async getSessionInfo(): Promise<{
        isValid: boolean;
        userId?: string;
        email?: string;
        expiresAt?: Date;
        idleTime: number;
    }> {
        try {
            const { data: { session }, error } = await supabase.auth
                .getSession();

            if (error || !session) {
                return { isValid: false, idleTime: 0 };
            }

            return {
                isValid: true,
                userId: session.user.id,
                email: session.user.email,
                expiresAt: session.expires_at
                    ? new Date(session.expires_at)
                    : undefined,
                idleTime: Date.now() - this.lastActivityTime,
            };
        } catch (error) {
            logger.error("Failed to get session info", error);
            return { isValid: false, idleTime: 0 };
        }
    }

    /**
     * Validate session token
     */
    public async validateSession(): Promise<boolean> {
        try {
            const { data: { session }, error } = await supabase.auth
                .getSession();

            if (error || !session) {
                return false;
            }

            // Check if token is expired
            const expiresAt = new Date(session.expires_at!).getTime();
            if (expiresAt < Date.now()) {
                return false;
            }

            // Check idle timeout
            const idleTime = Date.now() - this.lastActivityTime;
            if (idleTime > this.config.maxIdleTime) {
                return false;
            }

            return true;
        } catch (error) {
            logger.error("Session validation failed", error);
            return false;
        }
    }

    /**
     * Lock session (require re-authentication)
     */
    public async lockSession(): Promise<void> {
        try {
            // Store current session info for re-authentication
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                sessionStorage.setItem(
                    "locked_session",
                    JSON.stringify({
                        userId: session.user.id,
                        email: session.user.email,
                        lockedAt: Date.now(),
                    }),
                );
            }

            // Sign out locally but keep the session on the server
            await supabase.auth.signOut({ scope: "local" });

            // Redirect to lock screen
            window.location.href = "/auth/locked";
        } catch (error) {
            logger.error("Failed to lock session", error);
        }
    }

    /**
     * Update last activity time
     */
    public updateActivity(): void {
        this.lastActivityTime = Date.now();
    }

    /**
     * Get idle time in milliseconds
     */
    public getIdleTime(): number {
        return Date.now() - this.lastActivityTime;
    }
}

// Export singleton instance
export const sessionManager = SessionManager.getInstance();

// Export convenience functions
export const initializeSessionManager = () => sessionManager.initialize();
export const signOut = () => sessionManager.signOut();
export const validateSession = () => sessionManager.validateSession();
export const getSessionInfo = () => sessionManager.getSessionInfo();
export const lockSession = () => sessionManager.lockSession();
