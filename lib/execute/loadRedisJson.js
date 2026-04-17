// /lib/execute/loadRedisJson.js

import { kv } from "@vercel/kv";

export async function loadRedisJson(key, cache = {}) {
  if (typeof key !== "string" || key.trim().length === 0) {
    return null;
  }

  if (cache[key] !== undefined) {
    return cache[key];
  }

  try {
    const data = await kv.get(key);
    cache[key] = data ?? null;
    return cache[key];
  } catch (error) {
    console.error(`loadRedisJson error: ${key}`, error);
    cache[key] = null;
    return null;
  }
}
