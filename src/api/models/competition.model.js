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

const competitionSchema = new mongoose.Schema({
  sport: {
    ref: {
      type: mongoose.Schema.ObjectId,
      ref: "Sport"
    }
  },
  name: {
    type: String,
    required: true,
    trim: true,
  }

});

exports.Competition = mongoose.model('Competition', competitionSchema);
exports.competitionSchema = competitionSchema;
