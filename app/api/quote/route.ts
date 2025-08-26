import { NextRequest, NextResponse } from 'next/server';
import { getQuote } from '../../../lib/services/quote';
import {
  validateSymbol,
  getQueryParam,
  createErrorResponse,
  createSuccessResponse,
  withRateLimit,
  handleOptions,
} from '../../../lib/utils/api-helpers';
import type { QuoteResponse } from '../../../types/api';

async function handleQuoteRequest(request: NextRequest): Promise<NextResponse> {
  try {
    // Extract and validate symbol parameter
    const symbolParam = getQueryParam(request, 'symbol', true);
    if (!symbolParam) {
      return createErrorResponse('Symbol parameter is required', 400);
    }

    const symbol = validateSymbol(symbolParam);

    // Get quote data from service
    const quoteData = await getQuote(symbol);

    // Return successful response
    return createSuccessResponse<QuoteResponse>(quoteData);
  } catch (error) {
    console.error('Quote API error:', error);

    if (error instanceof Error) {
      if (error.message.includes('Invalid symbol')) {
        return createErrorResponse(error.message, 400);
      }
      if (
        error.message.includes('not found') ||
        error.message.includes('no data available')
      ) {
        return createErrorResponse(
          `Quote not found for symbol: ${error.message}`,
          404
        );
      }
      return createErrorResponse(
        `Failed to fetch quote: ${error.message}`,
        500
      );
    }

    return createErrorResponse('Internal server error', 500);
  }
}

// Apply rate limiting to the handler
const rateLimitedHandler = withRateLimit(handleQuoteRequest);

// GET handler for the quote endpoint
export async function GET(request: NextRequest): Promise<NextResponse> {
  return rateLimitedHandler(request);
}

// Handle OPTIONS requests for CORS
export async function OPTIONS(): Promise<NextResponse> {
  return handleOptions();
}
