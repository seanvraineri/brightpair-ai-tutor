
import { useState, useCallback } from 'react';

// Define a type for cache items
interface CacheItem {
  response: string;
  timestamp: number;
}

// Configurable parameters
const CACHE_TTL = 5 * 60 * 1000; // Client-side cache lifetime: 5 minutes
const MAX_CACHE_SIZE = 50; // Maximum number of cached responses

export const useAITutorCache = (userId?: string | null, activeTrackId?: string | null) => {
  // Create a client-side response cache
  const [responseCache] = useState<Map<string, CacheItem>>(new Map());

  // Helper function to generate cache keys
  const generateCacheKey = useCallback((content: string): string => {
    return `${userId || 'anonymous'}:${activeTrackId || 'null'}:${content.toLowerCase().trim()}`;
  }, [userId, activeTrackId]);

  // Helper function to clean cache when it gets too large
  const cleanCache = useCallback(() => {
    if (responseCache.size > MAX_CACHE_SIZE) {
      // Convert map to array, sort by timestamp (oldest first)
      const entries = Array.from(responseCache.entries());
      const oldestEntries = entries
        .sort((a, b) => a[1].timestamp - b[1].timestamp)
        .slice(0, entries.length - MAX_CACHE_SIZE);
      
      // Delete oldest entries
      oldestEntries.forEach(([key]) => responseCache.delete(key));
    }
  }, [responseCache]);

  // Get from cache
  const getCachedResponse = useCallback((content: string): string | null => {
    const cacheKey = generateCacheKey(content);
    const cached = responseCache.get(cacheKey);
    const now = Date.now();
    
    if (cached && (now - cached.timestamp < CACHE_TTL)) {
      console.log("Using cached response from client");
      return cached.response;
    }
    
    return null;
  }, [responseCache, generateCacheKey]);

  // Store in cache
  const setCachedResponse = useCallback((content: string, response: string): void => {
    const cacheKey = generateCacheKey(content);
    const now = Date.now();
    
    responseCache.set(cacheKey, {
      response,
      timestamp: now
    });
    
    // Clean cache if it's getting too large
    cleanCache();
  }, [responseCache, generateCacheKey, cleanCache]);

  return {
    getCachedResponse,
    setCachedResponse
  };
};
