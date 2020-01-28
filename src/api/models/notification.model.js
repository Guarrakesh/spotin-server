const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String,
  },

  body: {
    required: true,
    type: String,
  },

  imageUrl: {
    required: false,
    type: String,
  },

  type: {
    required: false,
    type: String,
    enum: ['info','warning','danger', 'success'],
    default: 'info',
  },
  payload: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  readAt: Date,

  priority: Number,

  campaign: String,

  
}, { timestamps: true });


exports.Notification = mongoose.model('Notification', notificationSchema);
