const mongoose = require('mongoose');
const { businessTypes } = require('./business.model');
const subscriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,

  },
  businessType: {
    type: String,
    enum: businessTypes
  }


}, { timestamps: true });

exports.UserSubscription = mongoose.model('UserSubscription', subscriptionSchema, 'user_subscriptions');
exports.useSubscriptionSchema = subscriptionSchema;