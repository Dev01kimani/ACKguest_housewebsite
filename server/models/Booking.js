const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: [true, 'Room is required']
  },
  guest_name: {
    type: String,
    required: [true, 'Guest name is required'],
    trim: true
  },
  guest_email: {
    type: String,
    required: [true, 'Guest email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  guest_phone: {
    type: String,
    required: [true, 'Guest phone is required'],
    trim: true
  },
  check_in_date: {
    type: Date,
    required: [true, 'Check-in date is required']
  },
  check_out_date: {
    type: Date,
    required: [true, 'Check-out date is required']
  },
  number_of_guests: {
    type: Number,
    required: [true, 'Number of guests is required'],
    min: [1, 'At least 1 guest is required']
  },
  meal_plan: {
    type: String,
    enum: ['bed_only', 'bb', 'half_board', 'full_board'],
    default: 'bed_only'
  },
  special_requests: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  total_amount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  deposit_amount: {
    type: Number,
    min: [0, 'Deposit amount cannot be negative']
  },
  deposit_paid: {
    type: Boolean,
    default: false
  },
  balance_amount: {
    type: Number,
    min: [0, 'Balance amount cannot be negative']
  },
  payment_status: {
    type: String,
    enum: ['pending_deposit', 'deposit_paid', 'fully_paid'],
    default: 'pending_deposit'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
bookingSchema.index({ room: 1, check_in_date: 1, check_out_date: 1 });
bookingSchema.index({ guest_email: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ payment_status: 1 });

// Virtual for number of nights
bookingSchema.virtual('nights').get(function() {
  return Math.ceil((this.check_out_date - this.check_in_date) / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to calculate deposit and balance
bookingSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('total_amount')) {
    this.deposit_amount = Math.ceil((this.total_amount * 0.5) / 50) * 50; // 50% rounded to nearest 50
    this.balance_amount = this.total_amount - (this.deposit_paid ? this.deposit_amount : 0);
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);