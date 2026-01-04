import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt';
import { AppError } from './errorHandler';

/**
 * Extend Express Request to include user data
 */
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * Authentication Middleware
 * Verifies JWT token and extracts user information
 */
export const authMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(401, 'Authorization token is required');
    }

    const token = authHeader.slice(7); // Remove 'Bearer ' prefix

    const verifyResult = verifyToken(token);

    if (!verifyResult.valid || !verifyResult.payload) {
      throw new AppError(401, verifyResult.error || 'Invalid token');
    }

    // Attach user info to request
    req.user = verifyResult.payload;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError(401, 'Unauthorized access'));
    }
  }
};

/**
 * Role Guard Middleware
 * Allows access only if user role matches required roles
 * @param allowedRoles - Array of roles allowed to access the route
 */
export const roleGuard = (allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      // Ensure authMiddleware has been called first
      if (!req.user) {
        throw new AppError(401, 'User not authenticated');
      }

      const userRole = req.user.role;

      // Check if user role is in allowed roles
      if (!allowedRoles.includes(userRole)) {
        throw new AppError(
          403,
          `Access denied. Required roles: ${allowedRoles.join(', ')}`
        );
      }

      next();
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      } else {
        next(new AppError(403, 'Access denied'));
      }
    }
  };
};

/**
 * Combined Auth + Role Guard Middleware
 * Applies both authentication and role authorization in one call
 * @param allowedRoles - Array of roles allowed to access the route
 */
export const protectedRoute = (allowedRoles: string[]) => {
  return [authMiddleware, roleGuard(allowedRoles)];
};
