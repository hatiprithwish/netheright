import Constants from "@/constants";
import RedisClient from "./index";

class RedisCache {
  static async get<T>(
    key: string,
    loader: () => Promise<T>,
    ttlSeconds: number = Constants.DEFAULT_CACHE_KEY_TTL,
  ): Promise<T> {
    const redisClient = await RedisClient.getClient();
    const cachedResponse = await redisClient.get(key);
    if (cachedResponse) {
      return JSON.parse(cachedResponse) as T;
    }
    const dbResponse = await loader();
    await redisClient.setEx(key, ttlSeconds, JSON.stringify(dbResponse));
    return dbResponse;
  }

  static async invalidate(key: string): Promise<void> {
    const client = await RedisClient.getClient();
    await client.del(key);
  }
}

export default RedisCache;
