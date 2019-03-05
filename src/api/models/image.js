const mongoose = require('mongoose');


const imageVersionSchema = new mongoose.Schema({
  url: String,
  width: Number,
  height: Number
}, {_id: false });


const imageSchema = new mongoose.Schema({
  versions: [imageVersionSchema],
  ext: String,
  fileName: String,
  mime: String,
  order: {
    type: String,
  }
}, { timestamps: true, _id: true, strict: false  });


exports.imageSchema = imageSchema;
exports.image = mongoose.model('Image', imageSchema);
exports.imageVersionSchema = imageVersionSchema;
exports.imageVersion = mongoose.model('ImageVersion', imageVersionSchema);


