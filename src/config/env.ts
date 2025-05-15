/**
 * Environment configuration for the application
 * This file centralizes all environment-specific settings
 */

// Environment detection
export const IS_DEVELOPMENT = import.meta.env.MODE === 'development';
export const IS_PRODUCTION = import.meta.env.MODE === 'production';
export const IS_TEST = import.meta.env.MODE === 'test';

// Feature flags
export const FEATURES = {
  // Core features
  USE_EDGE_FUNCTIONS: IS_PRODUCTION, // Use Supabase edge functions in production
  USE_DIRECT_API: IS_DEVELOPMENT, // Use direct API calls in development
  
  // Experimental features - can be enabled/disabled per environment
  ENABLE_CUSTOM_LESSONS: true,
  ENABLE_PDF_EXTRACTION: true,
  
  // Analytics and monitoring
  ENABLE_ANALYTICS: IS_PRODUCTION,
  DEBUG_LOGGING: IS_DEVELOPMENT,
  
  // Mock data settings
  USE_MOCK_DATA: IS_DEVELOPMENT && !import.meta.env.VITE_USE_REAL_DATA,
  
  // Caching settings
  CACHE_TTL: IS_PRODUCTION ? 300000 : 60000, // 5 minutes in prod, 1 minute in dev
};

// API endpoints and service URLs
export const ENDPOINTS = {
  OPENAI: import.meta.env.VITE_OPENAI_API_URL || 'https://api.openai.com/v1',
  SUPABASE_FUNCTIONS: {
    AI_TUTOR: 'ai-tutor',
    GENERATE_FLASHCARDS: 'generate-flashcards',
    EXTRACT_PDF: 'extract-pdf-text',
    GENERATE_HOMEWORK: 'generate_homework',
  }
};

// API models and version configurations
export const AI_CONFIG = {
  DEFAULT_MODEL: IS_PRODUCTION ? 'gpt-4' : 'gpt-3.5-turbo',
  TEMPERATURE: 0.7,
  MAX_TOKENS: 1000,
};

// Application limits and quotas
export const LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_UPLOAD_FILES: 10,
  MAX_LESSONS_HISTORY: 50,
  MAX_MESSAGES_PER_CHAT: 100,
};

// Default retry configuration
export const RETRY_CONFIG = {
  attempts: IS_PRODUCTION ? 3 : 1,
  backoff: 300, // ms
};

export default {
  IS_DEVELOPMENT,
  IS_PRODUCTION,
  FEATURES,
  ENDPOINTS,
  AI_CONFIG,
  LIMITS,
  RETRY_CONFIG,
}; 