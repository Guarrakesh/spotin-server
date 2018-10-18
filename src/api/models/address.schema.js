const mongoose = require('mongoose');
const pointSchema = require('./point.schema');

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
