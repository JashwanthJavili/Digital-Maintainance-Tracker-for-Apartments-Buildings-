import dotenv from 'dotenv';
import path from 'path';
import app from './app';

// Load environment variables from project root
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const PORT: number = parseInt(process.env.PORT || '3000', 10);
const NODE_ENV: string = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Server running on port ${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
