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
export async function apiHandler(
  req: NextRequest,
  handler: () => Promise<NextResponse<any>>
): Promise<NextResponse<any>> {
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
 * Sort parameter interface for query results
 */
export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}

/**
 * Parse sort parameters from request URL
 * @param searchParams URL search params
 * @param allowedFields Fields allowed for sorting
 * @param defaultField Default field to sort by
 * @returns Sort parameters object
 */
export function parseSortParams(
  searchParams: URLSearchParams,
  allowedFields: string[],
  defaultField: string
): SortParams {
  const sortParam = searchParams.get('sort') || defaultField;

  // Check if sort direction is specified (e.g. -createdAt for descending)
  const isDescending = sortParam.startsWith('-');
  const field = isDescending ? sortParam.substring(1) : sortParam;

  // Validate field is allowed
  const validField = allowedFields.includes(field) ? field : defaultField;

  return {
    field: validField,
    direction: isDescending ? 'desc' : 'asc'
  };
}

/**
 * Extract bearer token from request headers
 * @param req NextRequest
 * @returns Bearer token or null if not found
 */
export function extractBearerToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7);
}

/**
 * Pagination parameters interface
 */
export interface PaginationParams {
  limit: number;
  offset: number;
  page: number;
}

/**
 * Parse pagination parameters from request URL
 * @param searchParams URL search params
 * @param defaultLimit Default number of items per page
 * @param maxLimit Maximum number of items per page
 * @returns Pagination parameters object
 */
export function parsePaginationParams(
  searchParams: URLSearchParams,
  defaultLimit: number = 20,
  maxLimit: number = 100
): PaginationParams {
  // Parse limit and offset with defaults and constraints
  const requestedLimit = parseInt(searchParams.get('limit') || String(defaultLimit), 10);
  const limit = Math.min(Math.max(1, requestedLimit), maxLimit);
  
  // Use page-based or offset-based pagination
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const requestedOffset = parseInt(searchParams.get('offset') || String((page - 1) * limit), 10);
  const offset = Math.max(0, requestedOffset);
  
  return {
    limit,
    offset,
    page: Math.floor(offset / limit) + 1
  };
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

