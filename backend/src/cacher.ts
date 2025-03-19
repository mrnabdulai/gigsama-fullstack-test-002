"use strict";

import IoRedis from "ioredis";
import config from "./config";
const redis = new IoRedis(config.redis);

export const set = async (
  key: string,
  data: Record<string, any>,
  ttl?: number
) => {
  if (ttl) {
    await redis.set(key, JSON.stringify(data), "EX", ttl);
  } else {
    await redis.set(key, JSON.stringify(data));
  }
};

export const get = async (key: string) => {
  const data = await redis.get(key);
  try {
    return JSON.parse(data);
  } catch (err) {
    return null;
  }
};

export const del = async (key: string) => {
  await redis.del(key);
};
