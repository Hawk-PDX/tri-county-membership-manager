/**
 * Health check endpoint to verify API is functioning
 */

import { NextRequest } from 'next/server';
import { HttpStatus } from '@/types/api';
import { 
  apiHandler, 
  createSuccessResponse 
} from '@/utils/api-utils';

interface HealthStatus {
  status: 'ok' | 'error';
  version: string;
  environment: string;
  timestamp: string;
  uptime: number;
}

/**
 * GET handler for health check endpoint
 */
export async function GET(req: NextRequest) {
  return apiHandler<HealthStatus>(req, async () => {
    // Calculate server uptime in seconds
    const uptime = Math.floor(process.uptime());
    
    // Get environment information
    const environment = process.env.NODE_ENV || 'development';
    
    // You could add more detailed health checks here:
    // - Database connection status
    // - External service availability
    // - Memory usage
    // - etc.
    
    const healthData: HealthStatus = {
      status: 'ok',
      version: process.env.APP_VERSION || '1.0.0',
      environment,
      timestamp: new Date().toISOString(),
      uptime
    };
    
    return createSuccessResponse(healthData, HttpStatus.OK);
  });
}

/**
 * HEAD handler - commonly used for availability monitoring
 */
export async function HEAD(req: NextRequest) {
  return apiHandler(req, async () => {
    // Return just a success response with no body for HEAD requests
    return createSuccessResponse({}, HttpStatus.OK);
  });
}

