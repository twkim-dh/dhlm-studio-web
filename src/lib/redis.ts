// Shared Redis client using ioredis. Connects via REDIS_URL provisioned by
// the Vercel ↔ Redis Cloud integration. The client is cached at module
// scope so a single connection is reused across hot reloads in dev and
// across requests on the same Vercel serverless instance.
//
// Tuning notes for serverless:
//   - lazyConnect: true   → first command opens the connection (no race
//                            with module load on cold start)
//   - enableOfflineQueue: true → queue commands until connect completes
//                                instead of immediate reject
//   - connectTimeout: 10s → cold-start TLS handshake to Redis Cloud
//                            occasionally exceeds 5s in us-east
//   - maxRetriesPerRequest: 2 → cap retries so a hung command surfaces
//                                as an error rather than hanging the fn

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
  const client = new Redis(url, {
    connectTimeout: 10000,
    maxRetriesPerRequest: 2,
    enableOfflineQueue: true,
    lazyConnect: true,
    retryStrategy: (times) => (times > 3 ? null : Math.min(times * 200, 1000)),
  });
  client.on('error', (e) => {
    // Surfaces in Vercel function logs without crashing the process.
    console.error('[redis] connection error:', e.message);
  });
  return client;
}

export function getRedis(): Redis {
  if (!global.__dhlmRedis) {
    global.__dhlmRedis = makeClient();
  }
  return global.__dhlmRedis;
}
