import { logger } from "@/services/logger";
import { apiRateLimiter, checkRateLimit } from "@/middleware/rateLimiter";
import {
    hasSQLInjectionRisk,
    sanitizeJSON,
    sanitizeUrlParam,
} from "@/utils/sanitizer";
import { getCorsHeaders } from "@/config/cors";
import { supabase } from "@/integrations/supabase/client";

interface SecureApiOptions {
    method?: string;
    headers?: Record<string, string>;
    body?: any;
    params?: Record<string, string>;
    skipRateLimit?: boolean;
    skipSanitization?: boolean;
}

interface ApiResponse<T = any> {
    data?: T;
    error?: string;
    status: number;
    headers?: Record<string, string>;
}

class SecureApiService {
    private baseUrl: string;
    private defaultHeaders: Record<string, string>;

    constructor(baseUrl?: string) {
        this.baseUrl = baseUrl || import.meta.env.VITE_SUPABASE_URL || "";
        this.defaultHeaders = {
            "Content-Type": "application/json",
            "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY || "",
        };
    }

    /**
     * Get current user ID for rate limiting
     */
    private async getUserId(): Promise<string> {
        const { data: { user } } = await supabase.auth.getUser();
        return user?.id || "anonymous";
    }

    /**
     * Build URL with query parameters
     */
    private buildUrl(
        endpoint: string,
        params?: Record<string, string>,
    ): string {
        const url = new URL(endpoint, this.baseUrl);

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                // Sanitize URL parameters
                const sanitizedValue = sanitizeUrlParam(value);
                url.searchParams.append(key, sanitizedValue);
            });
        }

        return url.toString();
    }

    /**
     * Sanitize request body
     */
    private sanitizeBody(body: any): any {
        if (!body) return body;

        // Check for SQL injection in string values
        const checkForInjection = (obj: any): void => {
            if (typeof obj === "string" && hasSQLInjectionRisk(obj)) {
                throw new Error("Potential SQL injection detected in request");
            } else if (typeof obj === "object" && obj !== null) {
                Object.values(obj).forEach(checkForInjection);
            }
        };

        try {
            checkForInjection(body);

            // Sanitize JSON if it's an object
            if (typeof body === "object") {
                return sanitizeJSON(JSON.stringify(body));
            }

            return body;
        } catch (error) {
            logger.error("Request sanitization failed", error);
            throw error;
        }
    }

    /**
     * Make a secure API request
     */
    async request<T = any>(
        endpoint: string,
        options: SecureApiOptions = {},
    ): Promise<ApiResponse<T>> {
        const {
            method = "GET",
            headers = {},
            body,
            params,
            skipRateLimit = false,
            skipSanitization = false,
        } = options;

        try {
            // Check rate limit
            if (!skipRateLimit) {
                const userId = await this.getUserId();
                const rateLimitResult = checkRateLimit(apiRateLimiter, userId);

                if (!rateLimitResult.success) {
                    return {
                        error: rateLimitResult.error,
                        status: 429,
                        headers: rateLimitResult.headers,
                    };
                }
            }

            // Build URL
            const url = this.buildUrl(endpoint, params);

            // Prepare headers
            const requestHeaders = {
                ...this.defaultHeaders,
                ...headers,
            };

            // Get CORS headers
            const corsHeaders = getCorsHeaders(window.location.origin);
            Object.assign(requestHeaders, corsHeaders);

            // Prepare body
            let requestBody = body;
            if (body && !skipSanitization) {
                requestBody = this.sanitizeBody(body);
            }

            // Make request
            const response = await fetch(url, {
                method,
                headers: requestHeaders,
                body: requestBody ? JSON.stringify(requestBody) : undefined,
            });

            // Parse response
            const contentType = response.headers.get("content-type");
            let responseData: any;

            if (contentType?.includes("application/json")) {
                responseData = await response.json();
            } else {
                responseData = await response.text();
            }

            // Handle errors
            if (!response.ok) {
                logger.error("API request failed", {
                    endpoint,
                    status: response.status,
                    error: responseData,
                });

                return {
                    error: responseData?.message || responseData ||
                        "Request failed",
                    status: response.status,
                };
            }

            // Log successful requests
            logger.debug("API request successful", {
                endpoint,
                method,
                status: response.status,
            });

            return {
                data: responseData,
                status: response.status,
            };
        } catch (error) {
            logger.error("API request error", {
                endpoint,
                error,
            });

            return {
                error: error instanceof Error ? error.message : "Network error",
                status: 0,
            };
        }
    }

    /**
     * GET request
     */
    async get<T = any>(
        endpoint: string,
        params?: Record<string, string>,
        options?: Omit<SecureApiOptions, "method" | "body" | "params">,
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            ...options,
            method: "GET",
            params,
        });
    }

    /**
     * POST request
     */
    async post<T = any>(
        endpoint: string,
        body?: any,
        options?: Omit<SecureApiOptions, "method" | "body">,
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            ...options,
            method: "POST",
            body,
        });
    }

    /**
     * PUT request
     */
    async put<T = any>(
        endpoint: string,
        body?: any,
        options?: Omit<SecureApiOptions, "method" | "body">,
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            ...options,
            method: "PUT",
            body,
        });
    }

    /**
     * DELETE request
     */
    async delete<T = any>(
        endpoint: string,
        options?: Omit<SecureApiOptions, "method">,
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            ...options,
            method: "DELETE",
        });
    }

    /**
     * PATCH request
     */
    async patch<T = any>(
        endpoint: string,
        body?: any,
        options?: Omit<SecureApiOptions, "method" | "body">,
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            ...options,
            method: "PATCH",
            body,
        });
    }
}

// Create singleton instance
export const secureApi = new SecureApiService();

// Export for custom instances
export default SecureApiService;
