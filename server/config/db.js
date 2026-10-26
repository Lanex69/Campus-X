import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Support both server/.env and root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Mask sensitive credentials in MongoDB URI strings for sanitized logging.
 */
export const maskUri = (rawUri) => {
  if (!rawUri) return 'undefined';
  return String(rawUri).replace(/(mongodb(?:\+srv)?:\/\/[^:]+:)([^@]+)(@)/, '$1*****$3');
};

// Graceful connection lifecycle event listeners
mongoose.connection.on('connected', () => {
  console.log('📡 MongoDB connection established.');
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected.');
});

mongoose.connection.on('error', (err) => {
  console.error(`❌ MongoDB connection event error: ${maskUri(err.message)}`);
});

/**
 * Connect to MongoDB Atlas or local instance.
 * Avoids global unbuffered commands that throw initialization errors before connection.
 */
export const connectDB = async () => {
  // If already connected, reuse existing connection
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('⚠️ MONGODB_URI is not defined in environment variables. Database connection deferred.');
    return null;
  }

  const connectOptions = {
    serverSelectionTimeoutMS: 5000,
    autoIndex: true,
  };

  // On Windows, localhost can resolve to IPv6 (::1). Using family: 4 guarantees immediate IPv4 binding.
  if (uri.includes('localhost') || uri.includes('127.0.0.1')) {
    connectOptions.family = 4;
  }

  try {
    const conn = await mongoose.connect(uri, connectOptions);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${maskUri(error.message)}`);
    return null;
  }
};

/**
 * Returns true if MongoDB connection state is active (readyState === 1).
 */
export const isDBConnected = () => mongoose.connection.readyState === 1;

export default connectDB;
