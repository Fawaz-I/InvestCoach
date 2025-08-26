interface TokenBucket {
  tokens: number;
  lastRefill: number;
  capacity: number;
  refillRate: number; // tokens per minute
}

interface RateLimitConfig {
  requestsPerMinute: number;
  burstCapacity: number;
}

export class RateLimiter {
  private buckets = new Map<string, TokenBucket>();
  private config: RateLimitConfig;
  private cleanupInterval: NodeJS.Timeout;

  constructor(
    config: RateLimitConfig = { requestsPerMinute: 30, burstCapacity: 60 }
  ) {
    this.config = config;

    // Cleanup expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
    
    // Prevent keeping the process alive in serverless environments
    this.cleanupInterval.unref?.();
  }

  private cleanup(): void {
    const now = Date.now();
    const fiveMinutesAgo = now - 5 * 60 * 1000;

    for (const [key, bucket] of this.buckets.entries()) {
      if (bucket.lastRefill < fiveMinutesAgo) {
        this.buckets.delete(key);
      }
    }
  }

  private refillBucket(bucket: TokenBucket): void {
    const now = Date.now();
    const timePassed = now - bucket.lastRefill;
    const tokensToAdd = Math.floor(
      (timePassed / (60 * 1000)) * bucket.refillRate
    );

    bucket.tokens = Math.min(bucket.capacity, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;
  }

  private getBucket(key: string): TokenBucket {
    let bucket = this.buckets.get(key);

    if (!bucket) {
      bucket = {
        tokens: this.config.burstCapacity,
        lastRefill: Date.now(),
        capacity: this.config.burstCapacity,
        refillRate: this.config.requestsPerMinute,
      };
      this.buckets.set(key, bucket);
    }

    this.refillBucket(bucket);
    return bucket;
  }

  checkLimit(key: string): boolean {
    const bucket = this.getBucket(key);
    return bucket.tokens > 0;
  }

  consumeToken(key: string): boolean {
    const bucket = this.getBucket(key);

    if (bucket.tokens > 0) {
      bucket.tokens--;
      return true;
    }

    return false;
  }

  getRemainingTokens(key: string): number {
    const bucket = this.getBucket(key);
    return bucket.tokens;
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.buckets.clear();
  }
}

// Singleton guard to prevent multiple instances in serverless/hot-reload environments
const globalRateLimiterRegistry = globalThis as unknown as {
  globalRateLimiter?: RateLimiter;
  finnhubLimiter?: RateLimiter;
  alphaLimiter?: RateLimiter;
};

// Global rate limiter instance
export const globalRateLimiter = globalRateLimiterRegistry.globalRateLimiter ??
  (globalRateLimiterRegistry.globalRateLimiter = new RateLimiter({
    requestsPerMinute: parseInt(
      process.env.RATE_LIMIT_REQUESTS_PER_MINUTE || '30'
    ),
    burstCapacity: parseInt(process.env.RATE_LIMIT_BURST_CAPACITY || '60'),
  }));

// Provider-specific rate limiters to prevent quota exhaustion
export const finnhubLimiter = globalRateLimiterRegistry.finnhubLimiter ??
  (globalRateLimiterRegistry.finnhubLimiter = new RateLimiter({
    requestsPerMinute: 60, // 60 requests per minute for Finnhub
    burstCapacity: 60,
  }));

export const alphaLimiter = globalRateLimiterRegistry.alphaLimiter ??
  (globalRateLimiterRegistry.alphaLimiter = new RateLimiter({
    requestsPerMinute: 5, // 5 requests per minute for Alpha Vantage (free tier)
    burstCapacity: 5,
  }));
