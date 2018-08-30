const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const uuidv4 = require('uuid/v4');
const APIError = require('../utils/APIError');
const { env, jwtSecret, jwtExpirationInterval } = require('../../config/vars');
const Sport = require('./sport.model.js');
const mongoosePaginate = require('mongoose-paginate');
const { slugify }  = require('lodash-addons');

const competitorSchema = new mongoose.Schema({
  sport: {
    type: mongoose.Schema.ObjectId,
    ref: "Sport"
  },
  name: {
    type: String,
    trim: true,
    maxlength: 128
  },
  image_versions: {
    type: Array,

  },
  slug: {
    type: String,
    trim: true,
    maxlenth: 128,
    lowercase: true,
  },


  first_name: {
    type: String,
    maxlength: 128,
    trim: true
  },
  last_name: {
    type: String,
    maxlength: 128,
    trim: true
  },
  full_name: {
    type: String,
    maxlength: 256,
    trim: true
  },
  isPerson: {
    type: Boolean,
    default: false
  }
});


competitorSchema.pre('save', function(next) {


  if ((this.isNew && !this.slug) || (this.isPerson && !this.isNew && this.isModified('full_name'))
  || (!this.isPerson && !this.isNew && this.isModified('name'))) {

    this.slug = slugify(this.isPerson ? this.full_name : this.name);

  }
  next();
});

competitorSchema.plugin(mongoosePaginate);
exports.competitorSchema = competitorSchema
exports.Competitor = mongoose.model('Competitor',competitorSchema);
