// Shared Redis client using ioredis. Connects via REDIS_URL provisioned by
// Upstash → Vercel integration. The client is cached at module scope so a
// single connection is reused across hot reloads in dev and across requests
// on the same Vercel serverless instance.
//
// Why ioredis (not @upstash/redis or @vercel/kv): the project's Vercel
// integration provisioned a REDIS_URL connection string, not the REST API
// credentials. ioredis works directly against the redis:// URL.

import Redis from 'ioredis';

declare global {
  // eslint-disable-next-line no-var
  var __dhlmRedis: Redis | undefined;
}

function makeClient(): Redis {
  const url = process.env.REDIS_URL;
  if (!url) {
    throw new Error('REDIS_URL environment variable is not set');
  }
  return new Redis(url, {
    // Avoid hanging serverless functions on a slow connect.
    connectTimeout: 5000,
    // ioredis defaults to retry forever; cap retries inside a serverless function.
    maxRetriesPerRequest: 3,
    enableOfflineQueue: false,
    lazyConnect: false,
  });
}

export function getRedis(): Redis {
  if (!global.__dhlmRedis) {
    global.__dhlmRedis = makeClient();
  }
  return global.__dhlmRedis;
}
