import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    date: {
      type: Date,
      required: [true, 'Booking date is required'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rejected', 'cancelled', 'completed'],
      default: 'pending',
    },
    numberOfPeople: {
      type: Number,
      default: 1,
      min: [1, 'Number of people must be at least 1'],
    },
    purpose: {
      type: String,
      trim: true,
      default: '',
    },
    adminNotes: {
      type: String,
      default: '',
    },
    cancellationReason: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Index for slot availability lookups
bookingSchema.index({ service: 1, date: 1, startTime: 1, status: 1 });

// Prevent duplicate active booking by same user for same service slot
bookingSchema.index(
  { user: 1, service: 1, date: 1, startTime: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ['pending', 'confirmed'] } },
  }
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
