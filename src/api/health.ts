import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/logger";

export interface HealthCheckResult {
    status: "healthy" | "degraded" | "unhealthy";
    timestamp: string;
    version: string;
    environment: string;
    checks: {
        database: HealthCheck;
        auth: HealthCheck;
        storage: HealthCheck;
        api: HealthCheck;
    };
    metrics?: {
        uptime: number;
        responseTime: number;
        memoryUsage?: number;
    };
}

interface HealthCheck {
    status: "pass" | "fail" | "warn";
    responseTime?: number;
    message?: string;
    error?: string;
}

// Track application start time
const appStartTime = Date.now();

/**
 * Check database connectivity
 */
async function checkDatabase(): Promise<HealthCheck> {
    const startTime = Date.now();

    try {
        // Try a simple query
        const { data, error } = await supabase
            .from("profiles")
            .select("count", { count: "exact", head: true });

        if (error) {
            return {
                status: "fail",
                responseTime: Date.now() - startTime,
                error: error.message,
            };
        }

        const responseTime = Date.now() - startTime;

        // Warn if response is slow
        if (responseTime > 1000) {
            return {
                status: "warn",
                responseTime,
                message: "Database response time is slow",
            };
        }

        return {
            status: "pass",
            responseTime,
        };
    } catch (error) {
        return {
            status: "fail",
            responseTime: Date.now() - startTime,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

/**
 * Check authentication service
 */
async function checkAuth(): Promise<HealthCheck> {
    const startTime = Date.now();

    try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
            return {
                status: "fail",
                responseTime: Date.now() - startTime,
                error: error.message,
            };
        }

        return {
            status: "pass",
            responseTime: Date.now() - startTime,
            message: session ? "Authenticated" : "No active session",
        };
    } catch (error) {
        return {
            status: "fail",
            responseTime: Date.now() - startTime,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

/**
 * Check storage service
 */
async function checkStorage(): Promise<HealthCheck> {
    const startTime = Date.now();

    try {
        // Try to list buckets
        const { data, error } = await supabase.storage.listBuckets();

        if (error) {
            return {
                status: "fail",
                responseTime: Date.now() - startTime,
                error: error.message,
            };
        }

        return {
            status: "pass",
            responseTime: Date.now() - startTime,
            message: `${data?.length || 0} buckets available`,
        };
    } catch (error) {
        return {
            status: "fail",
            responseTime: Date.now() - startTime,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

/**
 * Check API connectivity
 */
async function checkAPI(): Promise<HealthCheck> {
    const startTime = Date.now();

    try {
        // Check if Supabase URL is configured
        if (!import.meta.env.VITE_SUPABASE_URL) {
            return {
                status: "fail",
                responseTime: Date.now() - startTime,
                error: "Supabase URL not configured",
            };
        }

        // Make a simple API call
        const response = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/`,
            {
                method: "HEAD",
                headers: {
                    "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY || "",
                },
            },
        );

        if (!response.ok) {
            return {
                status: "fail",
                responseTime: Date.now() - startTime,
                error: `API responded with ${response.status}`,
            };
        }

        return {
            status: "pass",
            responseTime: Date.now() - startTime,
        };
    } catch (error) {
        return {
            status: "fail",
            responseTime: Date.now() - startTime,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

/**
 * Perform comprehensive health check
 */
export async function performHealthCheck(): Promise<HealthCheckResult> {
    const startTime = Date.now();

    try {
        // Run all checks in parallel
        const [database, auth, storage, api] = await Promise.all([
            checkDatabase(),
            checkAuth(),
            checkStorage(),
            checkAPI(),
        ]);

        // Determine overall status
        const checks = { database, auth, storage, api };
        const statuses = Object.values(checks).map((check) => check.status);

        let status: "healthy" | "degraded" | "unhealthy";
        if (statuses.every((s) => s === "pass")) {
            status = "healthy";
        } else if (statuses.some((s) => s === "fail")) {
            status = "unhealthy";
        } else {
            status = "degraded";
        }

        const result: HealthCheckResult = {
            status,
            timestamp: new Date().toISOString(),
            version: import.meta.env.VITE_APP_VERSION || "1.0.0",
            environment: import.meta.env.MODE || "production",
            checks,
            metrics: {
                uptime: Date.now() - appStartTime,
                responseTime: Date.now() - startTime,
            },
        };

        // Log health check result
        if (status !== "healthy") {
            logger.warn("Health check detected issues", result);
        }

        return result;
    } catch (error) {
        logger.error("Health check failed", error);

        return {
            status: "unhealthy",
            timestamp: new Date().toISOString(),
            version: import.meta.env.VITE_APP_VERSION || "1.0.0",
            environment: import.meta.env.MODE || "production",
            checks: {
                database: { status: "fail", error: "Check failed" },
                auth: { status: "fail", error: "Check failed" },
                storage: { status: "fail", error: "Check failed" },
                api: { status: "fail", error: "Check failed" },
            },
            metrics: {
                uptime: Date.now() - appStartTime,
                responseTime: Date.now() - startTime,
            },
        };
    }
}

/**
 * Simple health check endpoint
 */
export async function healthCheck(): Promise<
    { status: string; timestamp: string }
> {
    return {
        status: "ok",
        timestamp: new Date().toISOString(),
    };
}

/**
 * Readiness check - checks if app is ready to serve traffic
 */
export async function readinessCheck(): Promise<
    { ready: boolean; checks: Record<string, boolean> }
> {
    const checks = {
        database: false,
        auth: false,
        environment: false,
    };

    // Check environment variables
    checks.environment = !!(
        import.meta.env.VITE_SUPABASE_URL &&
        import.meta.env.VITE_SUPABASE_ANON_KEY
    );

    // Check database
    try {
        const dbCheck = await checkDatabase();
        checks.database = dbCheck.status === "pass";
    } catch {
        checks.database = false;
    }

    // Check auth
    try {
        const authCheck = await checkAuth();
        checks.auth = authCheck.status === "pass";
    } catch {
        checks.auth = false;
    }

    const ready = Object.values(checks).every((check) => check);

    return { ready, checks };
}

/**
 * Liveness check - simple check to see if app is running
 */
export function livenessCheck(): { alive: boolean; uptime: number } {
    return {
        alive: true,
        uptime: Date.now() - appStartTime,
    };
}
