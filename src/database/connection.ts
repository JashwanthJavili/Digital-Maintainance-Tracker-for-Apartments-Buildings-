import { createPool, Pool, PoolOptions } from 'mysql2/promise';

// Database configuration from environment variables
const dbConfig: PoolOptions = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || '',
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
  waitForConnections: true,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

let pool: Pool;

/**
 * Initialize the MySQL connection pool
 */
const initializePool = async (): Promise<Pool> => {
  try {
    pool = createPool(dbConfig);

    // Test the connection
    const connection = await pool.getConnection();
    console.log('[Database] MySQL connection pool initialized successfully');
    connection.release();

    return pool;
  } catch (error) {
    console.error('[Database] Failed to initialize connection pool:', error);
    throw error;
  }
};

/**
 * Get the MySQL connection pool
 */
const getPool = (): Pool => {
  if (!pool) {
    throw new Error('Database pool not initialized. Call initializePool() first.');
  }
  return pool;
};

/**
 * Close the connection pool
 */
const closePool = async (): Promise<void> => {
  if (pool) {
    try {
      await pool.end();
      console.log('[Database] Connection pool closed');
    } catch (error) {
      console.error('[Database] Error closing pool:', error);
    }
  }
};

export { initializePool, getPool, closePool, dbConfig };
