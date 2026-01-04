import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

/**
 * JWT Token Payload Interface
 */
export interface TokenPayload extends JwtPayload {
  userId: string | number;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * JWT Verification Result
 */
export interface VerifyTokenResult {
  valid: boolean;
  payload?: TokenPayload;
  error?: string;
}

const JWT_SECRET: string = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production';
const JWT_EXPIRY: string = process.env.JWT_EXPIRY || '7d';

/**
 * Generate JWT Token
 * @param userId - User ID
 * @param role - User role
 * @returns Generated JWT token
 */
export const generateToken = (userId: string | number, role: string): string => {
  try {
    const payload: TokenPayload = {
      userId,
      role,
    };

    const signOptions: SignOptions = {
      expiresIn: JWT_EXPIRY,
    } as SignOptions;

    const token = jwt.sign(payload, JWT_SECRET, signOptions);

    return token;
  } catch (error) {
    console.error('[JWT] Error generating token:', error);
    throw error;
  }
};

/**
 * Verify JWT Token
 * @param token - JWT token to verify
 * @returns Verification result with payload or error
 */
export const verifyToken = (token: string): VerifyTokenResult => {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;

    return {
      valid: true,
      payload,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Token verification failed';

    console.error('[JWT] Error verifying token:', errorMessage);

    return {
      valid: false,
      error: errorMessage,
    };
  }
};

/**
 * Decode JWT Token (without verification)
 * @param token - JWT token to decode
 * @returns Decoded payload or null
 */
export const decodeToken = (token: string): TokenPayload | null => {
  try {
    const payload = jwt.decode(token) as TokenPayload | null;
    return payload;
  } catch (error) {
    console.error('[JWT] Error decoding token:', error);
    return null;
  }
};
