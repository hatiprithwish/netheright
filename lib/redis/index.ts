import { createClient, type RedisClientType } from "redis";
import { envConfig } from "../envConfig";

class RedisClient {
  private static instance: RedisClientType;

  static async getClient(): Promise<RedisClientType> {
    if (!RedisClient.instance) {
      RedisClient.instance = createClient({
        username: envConfig.REDIS_USERNAME,
        password: envConfig.REDIS_PASSWORD,
        socket: {
          host: envConfig.REDIS_HOST,
          port: Number(envConfig.REDIS_PORT),
        },
      }) as RedisClientType;
    }

    if (!RedisClient.instance.isOpen) {
      await RedisClient.instance.connect();
    }

    return RedisClient.instance;
  }
}

export default RedisClient;
