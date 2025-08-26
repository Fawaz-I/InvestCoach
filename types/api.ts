import { z } from 'zod';

// Quote API Response Types
export interface QuoteResponse {
  symbol: string;
  price: number;
  open: number;
  high: number;
  low: number;
  prevClose: number;
  volume: number;
  timestamp: number;
  source: 'finnhub' | 'alphavantage';
}

// Earnings API Response Types
export interface EarningsResponse {
  symbol: string;
  earningsDate: string; // ISO date string
  hour?: 'bmo' | 'amc' | 'dmh'; // before market open, after market close, during market hours
  source: 'finnhub';
}

// Error Response Type
export interface ApiError {
  error: string;
  timestamp: string;
}

// Zod schemas for runtime validation
export const QuoteResponseSchema = z.object({
  symbol: z.string(),
  price: z.number(),
  open: z.number(),
  high: z.number(),
  low: z.number(),
  prevClose: z.number(),
  volume: z.number(),
  timestamp: z.number(),
  source: z.enum(['finnhub', 'alphavantage']),
});

export const EarningsResponseSchema = z.object({
  symbol: z.string(),
  earningsDate: z.string(),
  hour: z.enum(['bmo', 'amc', 'dmh']).optional(),
  source: z.literal('finnhub'),
});

export const ApiErrorSchema = z.object({
  error: z.string(),
  timestamp: z.string(),
});

// Symbol validation schema (reused from api-helpers)
export const SymbolSchema = z
  .string()
  .min(1, 'Symbol is required')
  .max(7, 'Symbol must be 7 characters or less')
  .regex(
    /^[A-Z0-9.-]+$/,
    'Symbol must contain only uppercase letters, numbers, dots, and hyphens'
  )
  .transform((str) => str.toUpperCase());

// API Request Query Parameters
export interface QuoteQueryParams {
  symbol: string;
}

export interface EarningsQueryParams {
  symbol: string;
}

// Type guards for runtime type checking
export function isQuoteResponse(obj: any): obj is QuoteResponse {
  return QuoteResponseSchema.safeParse(obj).success;
}

export function isEarningsResponse(obj: any): obj is EarningsResponse {
  return EarningsResponseSchema.safeParse(obj).success;
}

export function isApiError(obj: any): obj is ApiError {
  return ApiErrorSchema.safeParse(obj).success;
}

// HTTP status codes commonly used in the API
export const HttpStatusCodes = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Rate limiting types
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number; // timestamp
}

// API route handler types for Next.js
export type ApiRouteHandler = (
  request: Request,
  context: { params?: Record<string, string> }
) => Promise<Response>;

// Common API response wrapper
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  timestamp: string;
  success: boolean;
}

export function createApiResponse<T>(
  data: T,
  success: boolean = true
): ApiResponse<T> {
  return {
    data: success ? data : undefined,
    error: success
      ? undefined
      : typeof data === 'string'
      ? data
      : 'Unknown error',
    timestamp: new Date().toISOString(),
    success,
  };
}
