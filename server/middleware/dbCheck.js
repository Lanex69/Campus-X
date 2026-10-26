import mongoose from 'mongoose';

/**
 * Middleware ensuring MongoDB is in connected state (readyState === 1)
 * before attempting database queries. Prevents buffering hangs (bufferTimeoutMS)
 * and Mongoose unhandled initialization errors when database is offline.
 */
export const ensureDB = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(500).json({
      message: 'Database connection is unavailable. Please verify MONGODB_URI in .env (or server/.env) and ensure MongoDB Atlas is accessible.',
      database: 'disconnected',
    });
  }
  next();
};

export default ensureDB;
