/**
 * API utility functions for consistent response handling
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  ApiSuccessResponse, 
  ApiErrorResponse, 
  HttpStatus,
  ApiError
} from '@/types/api';

/**
 * Creates a success response
 */
export function createSuccessResponse<T>(
  data: T,
  statusCode: HttpStatus = HttpStatus.OK,
  meta?: ApiSuccessResponse['meta']
): NextResponse<ApiSuccessResponse<T>> {
  
  const response: ApiSuccessResponse<T> = {
    success: true,
    timestamp: new Date().toISOString(),
    statusCode,
    data
  };
  
  if (meta) {
    response.meta = meta;
  }
  
  return NextResponse.json(response, { status: statusCode });
}

/**
 * Creates an error response
 */
export function createErrorResponse(
  message: string,
  statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  code: string = 'INTERNAL_SERVER_ERROR',
  details?: any
): NextResponse<ApiErrorResponse> {
  
  const response: ApiErrorResponse = {
    success: false,
    timestamp: new Date().toISOString(),
    statusCode,
    error: {
      code,
      message,
      details
    }
  };
  
  return NextResponse.json(response, { status: statusCode });
}

/**
 * API request handler with error handling
 */
export async function apiHandler<T>(
  req: NextRequest,
  handler: () => Promise<NextResponse<ApiSuccessResponse<T>>>
): Promise<NextResponse<ApiSuccessResponse<T> | ApiErrorResponse>> {
  try {
    return await handler();
  } catch (error) {
    console.error('API Error:', error);
    
    if (error instanceof ApiError) {
      return createErrorResponse(
        error.message,
        error.statusCode,
        error.code,
        error.details
      );
    }
    
    // Handle generic errors
    return createErrorResponse(
      error instanceof Error ? error.message : 'An unexpected error occurred',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}

/**
 * Parse query parameters from URL
 */
export function parseQueryParams(req: NextRequest): Record<string, string | string[]> {
  const url = new URL(req.url);
  const queryParams: Record<string, string | string[]> = {};
  
  url.searchParams.forEach((value, key) => {
    if (queryParams[key]) {
      // If the parameter already exists, convert it to an array
      const existing = queryParams[key];
      if (Array.isArray(existing)) {
        existing.push(value);
      } else {
        queryParams[key] = [existing, value];
      }
    } else {
      queryParams[key] = value;
    }
  });
  
  return queryParams;
}

/**
 * Validates that a request has required headers like API keys
 */
export function validateApiRequest(
  req: NextRequest,
  requiredHeaders: string[] = []
): void {
  // Example: Check for API key
  if (requiredHeaders.includes('x-api-key')) {
    const apiKey = req.headers.get('x-api-key');
    if (!apiKey) {
      throw new ApiError(
        'API key is required',
        HttpStatus.UNAUTHORIZED,
        'MISSING_API_KEY'
      );
    }
    
    // In a real app, you would validate the API key here
    // if (!validateApiKey(apiKey)) {
    //   throw new ApiError(
    //     'Invalid API key',
    //     HttpStatus.UNAUTHORIZED,
    //     'INVALID_API_KEY'
    //   );
    // }
  }
}

