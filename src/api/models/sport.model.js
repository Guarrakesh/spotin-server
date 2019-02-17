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
const { imageVersionSchema } = require('./image');

const sportSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    maxlength: 128,
    index: true,
    trim: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  duration: { // Durata del match (in minuti)
    type: Number,
    default: 100,
  },
  slug: {
    lowercase: true,
    type: String,
    trim: true,
  },
  appealValue: Number,
  image_versions: [imageVersionSchema],
  has_competitors: Boolean,

});

sportSchema.pre('save', function(next) {

  if ((this.isNew && !this.slug) || (!this.isNew && this.isModified('name'))) {
    this.slug = slugify(this.name);
  }
  next();
});

sportSchema.method({
  transform() {
    const transformed = {};
    const fields = ['_id',
      'id',
      'active',
      'slug',
      'image_versions',
      'appealValue',
      'has_competitors',
      'duration',
        'name',
    ];
    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
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
