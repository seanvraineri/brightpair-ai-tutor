import { logger } from "@/services/logger";

interface RateLimitConfig {
    windowMs: number; // Time window in milliseconds
    maxRequests: number; // Maximum requests per window
    keyGenerator?: (identifier: string) => string; // Custom key generator
}

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

class RateLimiter {
    private limits: Map<string, RateLimitEntry> = new Map();
    private config: RateLimitConfig;

    constructor(config: RateLimitConfig) {
        this.config = {
            windowMs: config.windowMs || 60000, // Default: 1 minute
            maxRequests: config.maxRequests || 100, // Default: 100 requests
            keyGenerator: config.keyGenerator || ((id) => id),
        };

        // Clean up expired entries every minute
        setInterval(() => this.cleanup(), 60000);
    }

    private cleanup() {
        const now = Date.now();
        for (const [key, entry] of this.limits.entries()) {
            if (entry.resetTime < now) {
                this.limits.delete(key);
            }
        }
    }

    public checkLimit(
        identifier: string,
    ): { allowed: boolean; remaining: number; resetTime: number } {
        const key = this.config.keyGenerator!(identifier);
        const now = Date.now();

        let entry = this.limits.get(key);

        if (!entry || entry.resetTime < now) {
            // Create new entry or reset expired one
            entry = {
                count: 1,
                resetTime: now + this.config.windowMs,
            };
            this.limits.set(key, entry);

            return {
                allowed: true,
                remaining: this.config.maxRequests - 1,
                resetTime: entry.resetTime,
            };
        }

        // Check if limit exceeded
        if (entry.count >= this.config.maxRequests) {
            logger.warn("Rate limit exceeded", {
                identifier,
                count: entry.count,
            });
            return {
                allowed: false,
                remaining: 0,
                resetTime: entry.resetTime,
            };
        }

        // Increment count
        entry.count++;

        return {
            allowed: true,
            remaining: this.config.maxRequests - entry.count,
            resetTime: entry.resetTime,
        };
    }

    public reset(identifier: string): void {
        const key = this.config.keyGenerator!(identifier);
        this.limits.delete(key);
    }
}

// Pre-configured rate limiters for different use cases
export const apiRateLimiter = new RateLimiter({
    windowMs: 60000, // 1 minute
    maxRequests: 100, // 100 requests per minute
});

export const authRateLimiter = new RateLimiter({
    windowMs: 900000, // 15 minutes
    maxRequests: 5, // 5 auth attempts per 15 minutes
});

export const aiRateLimiter = new RateLimiter({
    windowMs: 60000, // 1 minute
    maxRequests: 10, // 10 AI requests per minute
});

// Supabase edge function compatible rate limit check
export function checkRateLimit(
    limiter: RateLimiter,
    identifier: string,
): { success: boolean; error?: string; headers?: Record<string, string> } {
    const result = limiter.checkLimit(identifier);

    if (!result.allowed) {
        return {
            success: false,
            error: "Rate limit exceeded. Please try again later.",
            headers: {
                "X-RateLimit-Limit": limiter["config"].maxRequests.toString(),
                "X-RateLimit-Remaining": "0",
                "X-RateLimit-Reset": new Date(result.resetTime).toISOString(),
                "Retry-After": Math.ceil((result.resetTime - Date.now()) / 1000)
                    .toString(),
            },
        };
    }

    return {
        success: true,
        headers: {
            "X-RateLimit-Limit": limiter["config"].maxRequests.toString(),
            "X-RateLimit-Remaining": result.remaining.toString(),
            "X-RateLimit-Reset": new Date(result.resetTime).toISOString(),
        },
    };
}

export default RateLimiter;
