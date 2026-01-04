/**
 * Standard API Response Contract
 * All API responses MUST use this format
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
}

/**
 * Success Response
 * @param data - Response data
 * @param message - Success message
 */
export const successResponse = <T = any>(data: T, message: string = 'Success'): ApiResponse<T> => {
  return {
    success: true,
    data,
    message,
  };
};

/**
 * Error Response
 * @param message - Error message
 * @param data - Optional error data
 */
export const errorResponse = <T = any>(message: string, data: T | null = null): ApiResponse<T> => {
  return {
    success: false,
    data: data as T,
    message,
  };
};

/**
 * Not Found Response
 * @param resource - Resource name
 */
export const notFoundResponse = (resource: string = 'Resource'): ApiResponse => {
  return {
    success: false,
    data: null,
    message: `${resource} not found`,
  };
};

/**
 * Validation Error Response
 * @param errors - Validation errors
 */
export const validationErrorResponse = (errors: any): ApiResponse => {
  return {
    success: false,
    data: errors,
    message: 'Validation failed',
  };
};

/**
 * Unauthorized Response
 */
export const unauthorizedResponse = (): ApiResponse => {
  return {
    success: false,
    data: null,
    message: 'Unauthorized access',
  };
};
