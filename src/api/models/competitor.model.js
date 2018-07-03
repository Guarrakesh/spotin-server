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
  slug: {
    type: String,
    trim: true,
    maxlenth: 128,
    lowercase: true,
    required: true,
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
  }
});

exports.competitorSchema = competitorSchema
exports.Competitor = mongoose.model('Competitor',competitorSchema);
