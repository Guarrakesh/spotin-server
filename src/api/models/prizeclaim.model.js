const mongoose = require('mongoose');

const StatusCodes = {
  STATUS_PENDING: 0,
  STATUS_REJECTED: -1,
  STATUS_GRANTING: 1,
  STATUS_GRANTED: 2,
}

const prizeClaimSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  prizeId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Prize'
  },
  status: {
    type: Number,
    enum: Object.values(StatusCodes),
    required: true,
    default: StatusCodes.STATUS_PENDING,
  },
  rejectedReason: {
    type: String,
  },
  requestIP: String,
  requestDevice: String,

  transactionId: {
    type: mongoose.Schema.ObjectId,
    ref: 'SpotCoinTransaction'
  }
}, { timestamps: true });




exports.StatusCodes = StatusCodes;
exports.prizeClaimSchema = prizeClaimSchema;
exports.PrizeClaim = mongoose.model('PrizeClaim', prizeClaimSchema, 'prizeclaims');