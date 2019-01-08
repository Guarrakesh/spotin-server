// @flow
const mongoose = require('mongoose');
const pointSchema = require('./point.schema');
const userHit = new mongoose.Schema({
  user: Object,
  timestamp: Date,
  entity_type: String,
  entity_id: String,
  meta: new mongoose.Schema({
    location: pointSchema,

  }, { id: false, strict: false })
}, { timestamps: false });


exports.UserHit = mongoose.model('UserHit', userHit, 'user_hits');