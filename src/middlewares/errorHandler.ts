import { Request, Response, NextFunction } from 'express';
import { ApiResponse, errorResponse } from '../utils/apiResponse';

/**
 * Custom Error class
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Global Error Handling Middleware
 * Must be used LAST in the middleware stack
 */
export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const timestamp = new Date().toISOString();
  let statusCode = 500;
  let message = 'Internal server error';
  let data: any = null;

  // Handle custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    data = err.data;
  }
  // Handle Validation Errors
  else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    data = err;
  }
  // Handle Cast Error (MongoDB)
  else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }
  // Handle Duplicate Key Error (MongoDB)
  else if ((err as any).code === 11000) {
    statusCode = 409;
    message = 'Duplicate field value';
    data = (err as any).keyPattern;
  }
  // Handle JWT Errors
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }
  // Generic Error
  else {
    statusCode = 500;
    message = err.message || 'Internal server error';
  }

  // Log error with timestamp
  console.error(`[${timestamp}] Error:`, {
    statusCode,
    message,
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  // Send error response using standard API response format
  const response: ApiResponse = errorResponse(message, data);

  res.status(statusCode).json(response);
};

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
