const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const uuidv4 = require('uuid/v4');
const APIError = require('../utils/APIError');
const { env, jwtSecret, jwtExpirationInterval } = require('../../config/vars');


const Competition = require('./competition.model');
const Competitor = require('./competitor.model');
const Sport = require('./sport.model');

const sportEventSchema = new mongoose.Schema({

  sport: Sport,
  competition: Competition,
  competitors: [Competitor],

  name: {

    type: String,
    trim: true,
    maxlength: 128

  },
  description: {
    type: String,
    trim: true
  }
});

module.exports = mongoose.model('SportEvent', sportEventSchema, 'sport_events');
