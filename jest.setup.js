// Jest setup file
process.env.NODE_ENV = 'test';

require('@testing-library/jest-dom');

// Mock import.meta
global.import = {
    meta: {
        env: {
            DEV: true,
            VITE_SUPABASE_URL: 'https://test.supabase.co',
            VITE_SUPABASE_ANON_KEY: 'test-anon-key',
            VITE_OPENAI_API_KEY: 'test-openai-key',
        }
    }
};

// Mock environment variables
process.env.VITE_SUPABASE_URL = 'https://test.supabase.co';
process.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.VITE_OPENAI_API_KEY = 'test-openai-key';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
    takeRecords() {
        return [];
    }
};
