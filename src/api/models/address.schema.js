const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
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
const addressSchema = new mongoose.Schema({


  street: {
    type: String,
    required: true
  },
  number: String,
  zip: Number,
  city: String,
  province: String,
  country: String,

  location: {
    type: pointSchema,
  }


});


module.exports = addressSchema;
