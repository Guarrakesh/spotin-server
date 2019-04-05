const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({

  type: {
    type: String,
    enum: ['Point'],
  },
  coordinates: {
    type: [Number],
  }
}, { _id: false });

module.exports = pointSchema;
