/**
 * Generic in-memory cache manager with per-key TTL.
 */

import Constants from "@/constants";

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class CacheManager {
  private static store = new Map<string, CacheEntry<unknown>>();

  static async get<T>(
    key: string,
    loader: () => Promise<T>,
    ttl: number = Constants.DEFAULT_CACHE_KEY_TTL,
  ): Promise<T> {
    const now = Date.now();
    const entry = this.store.get(key) as CacheEntry<T> | undefined;

    if (entry && now < entry.expiresAt) {
      return entry.value;
    }

    console.log(`[CacheManager] Cache miss — loading key: ${key}`);
    const value = await loader();
    this.store.set(key, { value, expiresAt: now + ttl });
    return value;
  }

  static invalidate(key: string): void {
    this.store.delete(key);
    console.log(`[CacheManager] Invalidated cache key: ${key}`);
  }

  static invalidateAll(): void {
    this.store.clear();
    console.log(`[CacheManager] All cache entries cleared`);
  }
}

export default CacheManager;
