// @flow
const mongoose = require('mongoose');
const pointSchema = require('./point.schema');
const userHit = new mongoose.Schema({

  entity_type: String,
  entity_id: String,
  meta: new mongoose.Schema({
    location: pointSchema,
    user: Object,

  }, { id: false, strict: false })
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });


exports.UserHit = mongoose.model('UserHit', userHit, 'user_hits');