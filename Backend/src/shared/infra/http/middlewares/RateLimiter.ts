import { Request, Response, NextFunction } from "express";
import { RateLimiterRedis } from "rate-limiter-flexible";
import Redis, { Redis as RedisClient } from "ioredis";

import cacheConfig from "@config/cache";
import AppError from "@shared/errors/AppError";

const redisClient = new Redis(cacheConfig.config.redis);

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "ratelimit",
  points: 5,
  duration: 1,
  blockDuration: 60,
});

async function rateLimiter(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await limiter.consume(req.ip);

    next();
  } catch (err) {
    throw new AppError("Too Many Requests", 429);
  }
}

export default rateLimiter;
