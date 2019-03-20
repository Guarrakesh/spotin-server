const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
  _id: { auto: false },
  type: {
    type: String,
    enum: ['Point'],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  }
});

module.exports = pointSchema;
