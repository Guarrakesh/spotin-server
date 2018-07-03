const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const uuidv4 = require('uuid/v4');
const APIError = require('../utils/APIError');
const { env, jwtSecret, jwtExpirationInterval } = require('../../config/vars');


const sportSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    maxlength: 128,
    index: true,
    trim: true
  }
});


module.export = mongoose.model('Sport', sportSchema, 'sports');
