import { NextRequest, NextResponse } from 'next/server';
import { getEarningsDate } from '../../../lib/services/earnings';
import {
  validateSymbol,
  getQueryParam,
  createErrorResponse,
  createSuccessResponse,
  withRateLimit,
  handleOptions,
} from '../../../lib/utils/api-helpers';
import type { EarningsResponse } from '../../../types/api';

async function handleEarningsRequest(
  request: NextRequest
): Promise<NextResponse> {
  try {
    // Extract and validate symbol parameter
    const symbolParam = getQueryParam(request, 'symbol', true);
    if (!symbolParam) {
      return createErrorResponse('Symbol parameter is required', 400);
    }

    const symbol = validateSymbol(symbolParam);

    // Get earnings data from service
    const earningsData = await getEarningsDate(symbol);

    // Return successful response
    return createSuccessResponse<EarningsResponse>(earningsData);
  } catch (error) {
    console.error('Earnings API error:', error);

    if (error instanceof Error) {
      if (error.message.includes('Invalid symbol')) {
        return createErrorResponse(error.message, 400);
      }
      if (
        error.message.includes('No upcoming earnings') ||
        error.message.includes('not found')
      ) {
        return createErrorResponse(
          `No upcoming earnings date found for the specified symbol`,
          404
        );
      }
      return createErrorResponse(
        `Failed to fetch earnings date: ${error.message}`,
        500
      );
    }

    return createErrorResponse('Internal server error', 500);
  }
}

// Apply rate limiting to the handler
const rateLimitedHandler = withRateLimit(handleEarningsRequest);

// GET handler for the earnings-date endpoint
export async function GET(request: NextRequest): Promise<NextResponse> {
  return rateLimitedHandler(request);
}

// Handle OPTIONS requests for CORS
export async function OPTIONS(): Promise<NextResponse> {
  return handleOptions();
}
