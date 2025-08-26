import { serverEnv } from '../env';
import { finnhubLimiter, alphaLimiter } from './rate-limit';
import { httpGet } from './_http';

import type { QuoteResponse as QuoteData } from '../../types/api';

interface FinnhubQuoteResponse {
  c: number; // current price
  h: number; // high
  l: number; // low
  o: number; // open
  pc: number; // previous close
  t: number; // timestamp
}

interface AlphaVantageQuoteResponse {
  'Global Quote': {
    '01. symbol': string;
    '02. open': string;
    '03. high': string;
    '04. low': string;
    '05. price': string;
    '06. volume': string;
    '07. latest trading day': string;
    '08. previous close': string;
    '09. change': string;
    '10. change percent': string;
  };
}

// Simple in-memory cache with TTL
interface CacheEntry {
  data: QuoteData;
  timestamp: number;
  ttl: number;
}

class QuoteCache {
  private cache = new Map<string, CacheEntry>();
  private readonly DEFAULT_TTL = 60 * 1000; // 1 minute

  set(key: string, data: QuoteData, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): QuoteData | null {
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

const quoteCache = new QuoteCache();

export async function getQuoteFromFinnhub(symbol: string): Promise<QuoteData> {
  // Check provider rate limit
  if (!finnhubLimiter.consumeToken('finnhub')) {
    throw new Error('FINNHUB_RATE_LIMIT: Provider rate limit exceeded');
  }

  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${serverEnv.FINNHUB_API_KEY}`;

  const response = await httpGet(url);

  if (!response.ok) {
    throw new Error(
      `Finnhub API error: ${response.status} ${response.statusText}`
    );
  }

  const data: FinnhubQuoteResponse = await response.json();

  // Check if the response contains valid data
  if (data.c === 0 && data.h === 0 && data.l === 0 && data.o === 0) {
    throw new Error(`Invalid symbol or no data available: ${symbol}`);
  }

  return {
    symbol: symbol.toUpperCase(),
    price: data.c,
    open: data.o,
    high: data.h,
    low: data.l,
    prevClose: data.pc,
    volume: 0, // Finnhub doesn't provide volume in the quote endpoint
    timestamp: data.t * 1000, // Convert to milliseconds
    source: 'finnhub',
  };
}

export async function getQuoteFromAlphaVantage(
  symbol: string
): Promise<QuoteData> {
  // Check provider rate limit
  if (!alphaLimiter.consumeToken('alphavantage')) {
    throw new Error('ALPHA_RATE_LIMIT: Provider rate limit exceeded');
  }

  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${serverEnv.ALPHA_VANTAGE_API_KEY}`;

  const response = await httpGet(url);

  if (!response.ok) {
    throw new Error(
      `Alpha Vantage API error: ${response.status} ${response.statusText}`
    );
  }

  const data: any = await response.json();

  // Check for Alpha Vantage specific error/rate limit responses
  if (data.Note) {
    throw new Error(`ALPHA_RATE_LIMIT: ${data.Note}`);
  }

  if (data['Error Message']) {
    throw new Error(`ALPHA_ERROR: ${data['Error Message']}`);
  }

  if (!data['Global Quote'] || !data['Global Quote']['01. symbol']) {
    throw new Error(`Invalid symbol or no data available: ${symbol}`);
  }

  const quote = data['Global Quote'];

  return {
    symbol: quote['01. symbol'],
    price: parseFloat(quote['05. price']),
    open: parseFloat(quote['02. open']),
    high: parseFloat(quote['03. high']),
    low: parseFloat(quote['04. low']),
    prevClose: parseFloat(quote['08. previous close']),
    volume: parseInt(quote['06. volume']),
    timestamp: new Date(quote['07. latest trading day']).getTime(),
    source: 'alphavantage',
  };
}

export async function getQuote(symbol: string): Promise<QuoteData> {
  const normalizedSymbol = symbol.toUpperCase();

  // Check cache first
  const cached = quoteCache.get(normalizedSymbol);
  if (cached) {
    return cached;
  }

  try {
    // Try Finnhub first (primary provider)
    const quote = await getQuoteFromFinnhub(normalizedSymbol);
    quoteCache.set(normalizedSymbol, quote);
    return quote;
  } catch (finnhubError) {
    console.warn(`Finnhub failed for ${normalizedSymbol}:`, finnhubError);

    try {
      // Fallback to Alpha Vantage
      const quote = await getQuoteFromAlphaVantage(normalizedSymbol);
      quoteCache.set(normalizedSymbol, quote);
      return quote;
    } catch (alphaVantageError) {
      console.error(
        `Alpha Vantage fallback failed for ${normalizedSymbol}:`,
        alphaVantageError
      );

      // Re-throw the original Finnhub error if both fail
      throw new Error(
        `Failed to fetch quote for ${normalizedSymbol}: ${
          finnhubError instanceof Error ? finnhubError.message : 'Unknown error'
        }`
      );
    }
  }
}

export { QuoteCache, quoteCache };
export type { QuoteData };
