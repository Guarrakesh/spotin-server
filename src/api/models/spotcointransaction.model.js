const mongoose = require('mongoose');

const StatusCodes = {
  STATUS_PENDING: 0,
  STATUS_CANCELED: -1,
  STATUS_COMPLETED: 1,
};

const TypeCodes = {
  BusinessToUser: 1000,
  UserToBusiness: 1001,
  UserToUser: 1002,
  UserToSpotIn: 1003,
  SpotInToUser: 1004,
  SpotInToBusiness: 1005,
  BusinessToSpotIn: 1006,
};
const spotCoinTransactionSchema = new mongoose.Schema({
  senderId: mongoose.Schema.ObjectId, // Se nullo, è SpotIn
  receiverId: mongoose.Schema.ObjectId, // Se nullo, è SpotIn
  amount: {
    required: true,
    type: Number,
  },
  status: {
    enum: Object.values(StatusCodes),
    default: 0,
    type: Number,
    required: true,
  },
  type: {
    enum: Object.values(TypeCodes),
    required: true,
    type: Number,
  },
  meta: new mongoose.Schema({
    description: String,
  }, { _id: false, strict: false }),
}, { timestamps: true });

exports.spotCoinTransactionSchema = spotCoinTransactionSchema;
exports.SpotCoinTransaction = mongoose.model('SpotCoinTransaction', spotCoinTransactionSchema, 'spotcointransactions');
exports.StatusCodes = StatusCodes;
exports.TypeCodes = TypeCodes;
