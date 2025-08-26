import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { globalRateLimiter } from '../services/rate-limit';

// Symbol validation schema
const symbolSchema = z
  .string()
  .min(1, 'Symbol is required')
  .max(7, 'Symbol must be 7 characters or less')
  .regex(
    /^[A-Z0-9.-]+$/,
    'Symbol must contain only uppercase letters, numbers, dots, and hyphens'
  )
  .transform((str) => str.toUpperCase());

export function validateSymbol(symbol: string): string {
  try {
    return symbolSchema.parse(symbol);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid symbol: ${error.issues[0].message}`);
    }
    throw new Error('Invalid symbol format');
  }
}

export function getClientIP(request: NextRequest): string {
  // Check for forwarded IP first (common in production with proxies)
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  // Check for real IP (some proxies use this)
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Fallback to connecting IP or unknown
  return request.headers.get('x-connecting-ip') || 'unknown';
}

export function createErrorResponse(
  message: string,
  status: number = 500
): NextResponse {
  return NextResponse.json(
    {
      error: message,
      timestamp: new Date().toISOString(),
    },
    {
      status,
      headers: getCorsHeaders(),
    }
  );
}

export function createSuccessResponse<T>(
  data: T,
  status: number = 200
): NextResponse {
  return NextResponse.json(data, {
    status,
    headers: getCorsHeaders(),
  });
}

export function createRateLimitResponse(
  message: string,
  retryAfterSeconds: number = 60
): NextResponse {
  return NextResponse.json(
    {
      error: message,
      timestamp: new Date().toISOString(),
    },
    {
      status: 429,
      headers: {
        'Retry-After': retryAfterSeconds.toString(),
        ...getCorsHeaders(),
      },
    }
  );
}

// Rate limiting decorator/wrapper for API handlers
export function withRateLimit<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>,
  keyGenerator?: (...args: T) => string
) {
  return async (...args: T): Promise<NextResponse> => {
    const request = args[0] as NextRequest;

    // Generate rate limit key (default to client IP)
    const rateLimitKey = keyGenerator
      ? keyGenerator(...args)
      : getClientIP(request);

    // Check rate limit and consume token in one operation
    if (!globalRateLimiter.consumeToken(rateLimitKey)) {
      return createRateLimitResponse(
        'Too many requests. Please try again later.',
        60
      );
    }

    // Call the original handler
    try {
      return await handler(...args);
    } catch (error) {
      console.error('API handler error:', error);

      // Return appropriate error response
      if (error instanceof Error) {
        if (error.message.includes('Missing required query parameter')) {
          return createErrorResponse(error.message, 400);
        }
        if (
          error.message.includes('Invalid symbol') ||
          error.message.startsWith('ALPHA_ERROR:')
        ) {
          return createErrorResponse(error.message, 400);
        }
        if (
          error.message.startsWith('ALPHA_RATE_LIMIT:') ||
          error.message.startsWith('FINNHUB_RATE_LIMIT:')
        ) {
          return createRateLimitResponse(error.message, 60);
        }
        if (
          error.message.includes('not found') ||
          error.message.includes('No upcoming')
        ) {
          return createErrorResponse(error.message, 404);
        }
        return createErrorResponse(error.message, 500);
      }

      return createErrorResponse('Internal server error', 500);
    }
  };
}

// Helper to extract and validate query parameters
export function getQueryParam(
  request: NextRequest,
  paramName: string,
  required: boolean = true
): string | null {
  const { searchParams } = new URL(request.url);
  const value = searchParams.get(paramName);

  if (required && !value) {
    throw new Error(`Missing required query parameter: ${paramName}`);
  }

  return value;
}

// Common response headers for API routes
export function getCorsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  };
}

// Helper for handling OPTIONS requests (CORS preflight)
export function handleOptions(): NextResponse {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(),
  });
}
