import RateLimiter, {
    apiRateLimiter,
    authRateLimiter,
    checkRateLimit,
} from "../rateLimiter";

describe("RateLimiter", () => {
    let rateLimiter: RateLimiter;

    beforeEach(() => {
        // Create a new rate limiter with short window for testing
        rateLimiter = new RateLimiter({
            windowMs: 1000, // 1 second
            maxRequests: 3,
        });
    });

    describe("checkLimit", () => {
        it("should allow requests within the limit", () => {
            const identifier = "test-user";

            // First request
            const result1 = rateLimiter.checkLimit(identifier);
            expect(result1.allowed).toBe(true);
            expect(result1.remaining).toBe(2);

            // Second request
            const result2 = rateLimiter.checkLimit(identifier);
            expect(result2.allowed).toBe(true);
            expect(result2.remaining).toBe(1);

            // Third request
            const result3 = rateLimiter.checkLimit(identifier);
            expect(result3.allowed).toBe(true);
            expect(result3.remaining).toBe(0);
        });

        it("should block requests exceeding the limit", () => {
            const identifier = "test-user";

            // Make 3 allowed requests
            for (let i = 0; i < 3; i++) {
                rateLimiter.checkLimit(identifier);
            }

            // Fourth request should be blocked
            const result = rateLimiter.checkLimit(identifier);
            expect(result.allowed).toBe(false);
            expect(result.remaining).toBe(0);
        });

        it("should reset limits after the time window", async () => {
            const identifier = "test-user";

            // Max out the limit
            for (let i = 0; i < 3; i++) {
                rateLimiter.checkLimit(identifier);
            }

            // Should be blocked
            expect(rateLimiter.checkLimit(identifier).allowed).toBe(false);

            // Wait for window to expire
            await new Promise((resolve) => setTimeout(resolve, 1100));

            // Should be allowed again
            const result = rateLimiter.checkLimit(identifier);
            expect(result.allowed).toBe(true);
            expect(result.remaining).toBe(2);
        });

        it("should track different identifiers separately", () => {
            const user1 = "user-1";
            const user2 = "user-2";

            // Max out user1
            for (let i = 0; i < 3; i++) {
                rateLimiter.checkLimit(user1);
            }

            // user1 should be blocked
            expect(rateLimiter.checkLimit(user1).allowed).toBe(false);

            // user2 should still be allowed
            const result = rateLimiter.checkLimit(user2);
            expect(result.allowed).toBe(true);
            expect(result.remaining).toBe(2);
        });
    });

    describe("reset", () => {
        it("should reset limits for a specific identifier", () => {
            const identifier = "test-user";

            // Max out the limit
            for (let i = 0; i < 3; i++) {
                rateLimiter.checkLimit(identifier);
            }

            // Should be blocked
            expect(rateLimiter.checkLimit(identifier).allowed).toBe(false);

            // Reset the limit
            rateLimiter.reset(identifier);

            // Should be allowed again
            const result = rateLimiter.checkLimit(identifier);
            expect(result.allowed).toBe(true);
            expect(result.remaining).toBe(2);
        });
    });

    describe("checkRateLimit helper", () => {
        it("should return success when limit not exceeded", () => {
            const result = checkRateLimit(rateLimiter, "test-user");

            expect(result.success).toBe(true);
            expect(result.error).toBeUndefined();
            expect(result.headers).toBeDefined();
            expect(result.headers?.["X-RateLimit-Limit"]).toBe("3");
            expect(result.headers?.["X-RateLimit-Remaining"]).toBe("2");
        });

        it("should return error when limit exceeded", () => {
            // Max out the limit
            for (let i = 0; i < 3; i++) {
                rateLimiter.checkLimit("test-user");
            }

            const result = checkRateLimit(rateLimiter, "test-user");

            expect(result.success).toBe(false);
            expect(result.error).toBe(
                "Rate limit exceeded. Please try again later.",
            );
            expect(result.headers?.["X-RateLimit-Remaining"]).toBe("0");
            expect(result.headers?.["Retry-After"]).toBeDefined();
        });
    });

    describe("pre-configured rate limiters", () => {
        it("should have correct configuration for apiRateLimiter", () => {
            expect(apiRateLimiter).toBeDefined();
            // Test that it allows requests
            const result = apiRateLimiter.checkLimit("test-api-user");
            expect(result.allowed).toBe(true);
        });

        it("should have correct configuration for authRateLimiter", () => {
            expect(authRateLimiter).toBeDefined();
            // Test that it allows requests
            const result = authRateLimiter.checkLimit("test-auth-user");
            expect(result.allowed).toBe(true);
        });
    });
});
