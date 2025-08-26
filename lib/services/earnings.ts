import { serverEnv } from '../env';

interface EarningsData {
  symbol: string;
  earningsDate: string; // ISO date string
  hour?: 'bmo' | 'amc' | 'dmh'; // before market open, after market close, during market hours
  source: 'finnhub';
}

interface FinnhubEarningsCalendarResponse {
  earningsCalendar: Array<{
    date: string;
    epsActual: number | null;
    epsEstimate: number | null;
    hour: string;
    quarter: number;
    revenueActual: number | null;
    revenueEstimate: number | null;
    symbol: string;
    year: number;
  }>;
}

// Simple in-memory cache with longer TTL for earnings
interface CacheEntry {
  data: EarningsData;
  timestamp: number;
  ttl: number;
}

class EarningsCache {
  private cache = new Map<string, CacheEntry>();
  private readonly DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours

  set(key: string, data: EarningsData, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): EarningsData | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }
}

const earningsCache = new EarningsCache();

function formatDateForApi(date: Date): string {
  return date.toISOString().split('T')[0];
}

function normalizeEarningsHour(hour: string): 'bmo' | 'amc' | 'dmh' {
  const normalized = hour.toLowerCase();
  if (normalized.includes('before') || normalized === 'bmo') {
    return 'bmo';
  } else if (normalized.includes('after') || normalized === 'amc') {
    return 'amc';
  } else {
    return 'dmh';
  }
}

export async function getEarningsFromFinnhub(
  symbol: string
): Promise<EarningsData> {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + 90); // Look ahead 90 days

  const fromDate = formatDateForApi(today);
  const toDate = formatDateForApi(futureDate);

  const url = `https://finnhub.io/api/v1/calendar/earnings?from=${fromDate}&to=${toDate}&token=${serverEnv.FINNHUB_API_KEY}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Finnhub Earnings API error: ${response.status} ${response.statusText}`
    );
  }

  const data: FinnhubEarningsCalendarResponse = await response.json();

  if (!data.earningsCalendar || data.earningsCalendar.length === 0) {
    throw new Error(`No earnings calendar data available`);
  }

  const normalizedSymbol = symbol.toUpperCase();

  // Find the next earnings date for the specified symbol
  const symbolEarnings = data.earningsCalendar
    .filter((earning) => earning.symbol.toUpperCase() === normalizedSymbol)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .find((earning) => new Date(earning.date) >= today);

  if (!symbolEarnings) {
    throw new Error(`No upcoming earnings date found for ${normalizedSymbol}`);
  }

  return {
    symbol: symbolEarnings.symbol.toUpperCase(),
    earningsDate: symbolEarnings.date,
    hour: symbolEarnings.hour
      ? normalizeEarningsHour(symbolEarnings.hour)
      : undefined,
    source: 'finnhub',
  };
}

export async function getEarningsDate(symbol: string): Promise<EarningsData> {
  const normalizedSymbol = symbol.toUpperCase();

  // Check cache first
  const cached = earningsCache.get(normalizedSymbol);
  if (cached) {
    return cached;
  }

  try {
    const earnings = await getEarningsFromFinnhub(normalizedSymbol);
    earningsCache.set(normalizedSymbol, earnings);
    return earnings;
  } catch (error) {
    console.error(`Failed to fetch earnings for ${normalizedSymbol}:`, error);
    throw new Error(
      `Failed to fetch earnings date for ${normalizedSymbol}: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

export { EarningsCache, earningsCache };
export type { EarningsData };
