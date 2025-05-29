/**
 * Environment utilities that work with both Vite and Jest
 */

export const isDevelopment = (): boolean => {
    // For Jest tests
    if (typeof process !== "undefined" && process.env.NODE_ENV === "test") {
        return true;
    }

    // For Vite - commented out for Jest compatibility
    // This will be handled by build-time replacement
    // try {
    //     return import.meta.env.DEV;
    // } catch {
    // Fallback for environments that don't support import.meta
    return process.env.NODE_ENV !== "production";
    // }
};

export const getEnvVar = (key: string, defaultValue = ""): string => {
    // For Jest tests
    if (typeof process !== "undefined" && process.env[key]) {
        return process.env[key];
    }

    // For Vite - commented out for Jest compatibility
    // This will be handled by build-time replacement
    // try {
    //     const viteKey = key.startsWith("VITE_") ? key : `VITE_${key}`;
    //     return import.meta.env[viteKey] || defaultValue;
    // } catch {
    return defaultValue;
    // }
};
