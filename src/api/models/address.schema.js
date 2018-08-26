const mongoose = require('mongoose');


const addressSchema = new mongoose.Schema({
  latitude: String,
  longitude: String,

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
