import DOMPurify from "dompurify";
import { logger } from "@/services/logger";

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// SQL injection patterns
const SQL_INJECTION_PATTERNS = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
    /(-{2}|\/\*|\*\/)/g, // SQL comments
    /(;|\||&&)/g, // Command chaining
    /\b(OR|AND)\b.*=/i, // OR/AND with equals for tautologies like "1 OR 1=1"
];

// XSS patterns
const XSS_PATTERNS = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // Event handlers
];

export class InputSanitizer {
    /**
     * Sanitize HTML content to prevent XSS attacks
     */
    static sanitizeHTML(input: string): string {
        if (!input || typeof input !== "string") return "";

        // Configure DOMPurify
        const config = {
            ALLOWED_TAGS: [
                "b",
                "i",
                "em",
                "strong",
                "a",
                "p",
                "br",
                "ul",
                "ol",
                "li",
                "code",
                "pre",
            ],
            ALLOWED_ATTR: ["href", "target", "rel"],
            ALLOW_DATA_ATTR: false,
        };

        return DOMPurify.sanitize(input, config);
    }

    /**
     * Sanitize plain text input
     */
    static sanitizeText(input: string): string {
        if (!input || typeof input !== "string") return "";

        // Remove any HTML tags
        let sanitized = input.replace(/<[^>]*>/g, "");

        // Escape special characters
        sanitized = sanitized
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#x27;");

        return sanitized.trim();
    }

    /**
     * Validate and sanitize email addresses
     */
    static sanitizeEmail(email: string): string | null {
        if (!email || typeof email !== "string") return null;

        const trimmed = email.trim().toLowerCase();

        if (!EMAIL_REGEX.test(trimmed)) {
            logger.warn("Invalid email format detected", { email: trimmed });
            return null;
        }

        return trimmed;
    }

    /**
     * Sanitize numeric input
     */
    static sanitizeNumber(
        input: any,
        min?: number,
        max?: number,
    ): number | null {
        const num = Number(input);

        if (isNaN(num)) {
            return null;
        }

        if (min !== undefined && num < min) {
            return min;
        }

        if (max !== undefined && num > max) {
            return max;
        }

        return num;
    }

    /**
     * Sanitize URL parameters
     */
    static sanitizeUrlParam(param: string): string {
        if (!param || typeof param !== "string") return "";

        // URL encode the parameter
        return encodeURIComponent(param);
    }

    /**
     * Check for potential SQL injection attempts
     */
    static hasSQLInjectionRisk(input: string): boolean {
        if (!input || typeof input !== "string") return false;

        for (const pattern of SQL_INJECTION_PATTERNS) {
            if (pattern.test(input)) {
                logger.warn("Potential SQL injection detected", { input });
                return true;
            }
        }

        return false;
    }

    /**
     * Check for potential XSS attempts
     */
    static hasXSSRisk(input: string): boolean {
        if (!input || typeof input !== "string") return false;

        for (const pattern of XSS_PATTERNS) {
            if (pattern.test(input)) {
                logger.warn("Potential XSS attack detected", { input });
                return true;
            }
        }

        return false;
    }

    /**
     * Sanitize file names
     */
    static sanitizeFileName(fileName: string): string {
        if (!fileName || typeof fileName !== "string") return "unnamed";

        // Remove path traversal attempts
        let sanitized = fileName.replace(/[\/\\]/g, "");

        // Remove parent directory references
        sanitized = sanitized.replace(/\.\./g, "");

        // Remove special characters except dots (for extensions), hyphens, and underscores
        sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, "");

        // Ensure it doesn't start with a dot (hidden file)
        if (sanitized.startsWith(".")) {
            sanitized = sanitized.substring(1);
        }

        // If empty after sanitization, return default
        return sanitized || "unnamed";
    }

    /**
     * Validate and sanitize JSON input
     */
    static sanitizeJSON(jsonString: string): object | null {
        if (!jsonString || typeof jsonString !== "string") return null;

        try {
            const parsed = JSON.parse(jsonString);

            // Recursively sanitize string values in the object
            const sanitizeObject = (obj: any): any => {
                if (typeof obj === "string") {
                    return InputSanitizer.sanitizeText(obj);
                }

                if (Array.isArray(obj)) {
                    return obj.map(sanitizeObject);
                }

                if (obj && typeof obj === "object") {
                    const sanitized: any = {};
                    for (const [key, value] of Object.entries(obj)) {
                        // Sanitize the key as well
                        const sanitizedKey = InputSanitizer.sanitizeText(key);
                        sanitized[sanitizedKey] = sanitizeObject(value);
                    }
                    return sanitized;
                }

                return obj;
            };

            return sanitizeObject(parsed);
        } catch (error) {
            logger.warn("Invalid JSON input", { error });
            return null;
        }
    }

    /**
     * Sanitize form data object
     */
    static sanitizeFormData<T extends Record<string, any>>(data: T): T {
        const sanitized = {} as T;

        for (const [key, value] of Object.entries(data)) {
            const sanitizedKey = InputSanitizer.sanitizeText(key);

            if (typeof value === "string") {
                sanitized[sanitizedKey as keyof T] = InputSanitizer
                    .sanitizeText(
                        value,
                    ) as T[keyof T];
            } else if (typeof value === "number") {
                sanitized[sanitizedKey as keyof T] = InputSanitizer
                    .sanitizeNumber(
                        value,
                    ) as T[keyof T];
            } else if (value && typeof value === "object") {
                sanitized[sanitizedKey as keyof T] = InputSanitizer
                    .sanitizeFormData(
                        value,
                    );
            } else {
                sanitized[sanitizedKey as keyof T] = value;
            }
        }

        return sanitized;
    }

    /**
     * Validate UUID format
     */
    static isValidUUID(uuid: string): boolean {
        const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    }

    /**
     * Sanitize search queries
     */
    static sanitizeSearchQuery(query: string, maxLength: number = 100): string {
        if (!query || typeof query !== "string") return "";

        // Remove HTML tags first
        let sanitized = query.replace(/<[^>]*>/g, "");

        // Remove special characters that could be used for injection
        sanitized = sanitized.replace(/['"`;\\]/g, "");

        // Limit length
        sanitized = sanitized.substring(0, maxLength);

        // Trim whitespace
        return sanitized.trim();
    }
}

// Export convenience functions
export const {
    sanitizeHTML,
    sanitizeText,
    sanitizeEmail,
    sanitizeNumber,
    sanitizeUrlParam,
    hasSQLInjectionRisk,
    hasXSSRisk,
    sanitizeFileName,
    sanitizeJSON,
    sanitizeFormData,
    isValidUUID,
    sanitizeSearchQuery,
} = InputSanitizer;
