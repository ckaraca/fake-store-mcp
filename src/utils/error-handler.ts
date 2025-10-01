import type { ApiError } from '../api/types.js';

/**
 * Convert any error to a user-friendly message
 */
export function formatError(error: unknown): string {
  if (error instanceof Error) {
    // Check for HTTP errors
    if (error.message.includes('HTTP 404')) {
      return 'Resource not found. Please check the ID and try again.';
    }
    if (error.message.includes('HTTP 500')) {
      return 'Server error. Please try again later.';
    }
    if (error.message.includes('Failed to fetch')) {
      return 'Network error. Please check your internet connection.';
    }

    return error.message;
  }

  return 'An unexpected error occurred.';
}

/**
 * Create an ApiError object
 */
export function createApiError(
  message: string,
  statusCode?: number
): ApiError {
  return {
    message,
    statusCode,
  };
}

/**
 * Validate that an ID is a positive integer
 */
export function validateId(id: number, resourceName: string): void {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(
      `Invalid ${resourceName} ID: ${id}. Must be a positive integer.`
    );
  }
}

/**
 * Validate limit parameter
 */
export function validateLimit(limit?: number): void {
  if (limit !== undefined) {
    if (!Number.isInteger(limit) || limit <= 0) {
      throw new Error(
        `Invalid limit: ${limit}. Must be a positive integer.`
      );
    }
  }
}
