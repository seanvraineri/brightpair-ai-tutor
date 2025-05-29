/**
 * CORS (Cross-Origin Resource Sharing) configuration
 * for production security
 */

// Allowed origins based on environment
const getAllowedOrigins = (): string[] => {
    const origins: string[] = [];

    // Always allow localhost in development
    if (import.meta.env.DEV) {
        origins.push(
            "http://localhost:3000",
            "http://localhost:8080",
            "http://localhost:8081",
            "http://localhost:5173",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:8080",
            "http://127.0.0.1:8081",
            "http://127.0.0.1:5173",
        );
    }

    // Production origins
    if (import.meta.env.VITE_APP_URL) {
        origins.push(import.meta.env.VITE_APP_URL);
    }

    // Add any additional allowed origins from environment
    if (import.meta.env.VITE_ALLOWED_ORIGINS) {
        const additionalOrigins = import.meta.env.VITE_ALLOWED_ORIGINS.split(
            ",",
        )
            .map((origin: string) => origin.trim())
            .filter(Boolean);
        origins.push(...additionalOrigins);
    }

    // Supabase project URL
    if (import.meta.env.VITE_SUPABASE_URL) {
        origins.push(import.meta.env.VITE_SUPABASE_URL);
    }

    return [...new Set(origins)]; // Remove duplicates
};

// CORS headers configuration
export const corsHeaders = {
    "Access-Control-Allow-Origin": "*", // Will be replaced by specific origin check
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type, x-requested-with",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "86400", // 24 hours
};

// Check if origin is allowed
export const isOriginAllowed = (origin: string | null): boolean => {
    if (!origin) return false;

    const allowedOrigins = getAllowedOrigins();

    // Check exact match
    if (allowedOrigins.includes(origin)) {
        return true;
    }

    // Check wildcard subdomains (e.g., *.brightpair.com)
    for (const allowed of allowedOrigins) {
        if (allowed.startsWith("*.")) {
            const domain = allowed.substring(2);
            if (origin.endsWith(domain)) {
                return true;
            }
        }
    }

    return false;
};

// Get CORS headers for a specific origin
export const getCorsHeaders = (
    origin: string | null,
): Record<string, string> => {
    const headers = { ...corsHeaders };

    if (origin && isOriginAllowed(origin)) {
        headers["Access-Control-Allow-Origin"] = origin;
    } else if (import.meta.env.DEV) {
        // In development, allow any origin
        headers["Access-Control-Allow-Origin"] = "*";
    } else {
        // In production, use the primary app URL or deny
        headers["Access-Control-Allow-Origin"] = import.meta.env.VITE_APP_URL ||
            "null";
    }

    return headers;
};

// Handle preflight requests
export const handleCorsPreflightRequest = (
    request: Request,
): Response | null => {
    if (request.method !== "OPTIONS") {
        return null;
    }

    const origin = request.headers.get("Origin");
    const headers = getCorsHeaders(origin);

    return new Response(null, {
        status: 204,
        headers,
    });
};

// Validate request origin
export const validateRequestOrigin = (request: Request): boolean => {
    const origin = request.headers.get("Origin");

    // Allow requests without origin header (same-origin requests)
    if (!origin) {
        return true;
    }

    return isOriginAllowed(origin);
};

// Security headers for production
export const securityHeaders = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Content-Security-Policy": getContentSecurityPolicy(),
};

// Content Security Policy configuration
function getContentSecurityPolicy(): string {
    const policies = {
        "default-src": ["'self'"],
        "script-src": [
            "'self'",
            "'unsafe-inline'", // Required for some React features
            "'unsafe-eval'", // Required for development (remove in production)
            "https://cdn.jsdelivr.net", // For libraries
            "https://*.supabase.co", // Supabase
        ],
        "style-src": [
            "'self'",
            "'unsafe-inline'", // Required for styled-components
            "https://fonts.googleapis.com",
            "https://cdn.jsdelivr.net",
        ],
        "font-src": [
            "'self'",
            "https://fonts.gstatic.com",
            "data:", // For inline fonts
        ],
        "img-src": [
            "'self'",
            "data:",
            "blob:",
            "https://*.supabase.co",
            "https://www.gravatar.com",
            "https://avatars.githubusercontent.com",
        ],
        "connect-src": [
            "'self'",
            "https://*.supabase.co",
            "wss://*.supabase.co", // WebSocket connections
            import.meta.env.VITE_SUPABASE_URL || "",
            import.meta.env.VITE_APP_URL || "",
        ],
        "media-src": ["'self'", "blob:", "https://*.supabase.co"],
        "object-src": ["'none'"],
        "frame-ancestors": ["'none'"],
        "base-uri": ["'self'"],
        "form-action": ["'self'"],
        "upgrade-insecure-requests": [],
    };

    // Remove unsafe-eval in production
    if (!import.meta.env.DEV) {
        policies["script-src"] = policies["script-src"].filter((src) =>
            src !== "'unsafe-eval'"
        );
    }

    // Build CSP string
    return Object.entries(policies)
        .map(([directive, sources]) => {
            if (sources.length === 0) {
                return directive;
            }
            return `${directive} ${sources.filter(Boolean).join(" ")}`;
        })
        .join("; ");
}

// Apply security headers to response
export const applySecurityHeaders = (response: Response): Response => {
    const newHeaders = new Headers(response.headers);

    Object.entries(securityHeaders).forEach(([key, value]) => {
        newHeaders.set(key, value);
    });

    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
    });
};

// Export all configurations
export default {
    corsHeaders,
    securityHeaders,
    isOriginAllowed,
    getCorsHeaders,
    handleCorsPreflightRequest,
    validateRequestOrigin,
    applySecurityHeaders,
    getAllowedOrigins,
};
