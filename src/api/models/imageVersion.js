const mongoose = require('mongoose');


const imageVersionSchema = new mongoose.Schema({
  url: String,
  width: Number,
  height: Number
});

exports.imageVersionSchema = imageVersionSchema;
exports.imageVersion = mongoose.model('ImageVersion', imageVersionSchema);
