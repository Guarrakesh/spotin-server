const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const uuidv4 = require('uuid/v4');
const APIError = require('../utils/APIError');
const { env, jwtSecret, jwtExpirationInterval } = require('../../config/vars');
const { slugify } = require('lodash-addons');
const { imageVersionSchema } = require('./imageVersion');

const sportSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    maxlength: 128,
    index: true,
    trim: true
  },
  active: {
    type: Boolean,
    default: true,
  },
  slug: {
    lowercase: true,
    type: String,
    trim: true,
  },
  image_versions: [imageVersionSchema]


});

sportSchema.pre('save', function(next) {

  if ((this.isNew && !this.slug) || (!this.isNew && this.isModified('name'))) {
    this.slug = slugify(this.name);
  }
  next();
});
sportSchema.statics = {
  async get(id) {
    try {
      let sport;
      if (mongoose.Types.ObjectId.isValid(id)) {
        sport = await this.findById(id).exec()
      }
      if (sport) {
        return sport;
      }
      throw new APIError({
        message: "Sport does not exist",
        status: httpStatus.NOT_FOUND
      });
    } catch (error) {
      throw error;
    }
  },



}
exports.sportSchema = sportSchema;
exports.Sport = mongoose.model('Sport', sportSchema);
