const mongoose = require('mongoose');


const addressSchema = new mongoose.Schema({
  latitude: {
    type: String,
    requied: true,
  },
  longitude: {
    type: String,
    required: true
  },

  street: {
    type: String,
    required: true
  },
  number: String,
  zip: Number,
  city: String,
  province: String,
  country: String,


});


module.exports = addressSchema;
