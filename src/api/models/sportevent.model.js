const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const uuidv4 = require('uuid/v4');
const APIError = require('../utils/APIError');
const { env, jwtSecret, jwtExpirationInterval } = require('../../config/vars');


const {Competition} = require('./competition.model');
const {competitorSchema} = require('./competitor.model');
const Sport = require('./sport.model');

const sportEventSchema = new mongoose.Schema({

  sport: {
    type: mongoose.Schema.ObjectId,
    ref: "Sport"
  },
  competition: {
    type: mongoose.Schema.ObjectId,
    ref: 'Competition'
  },
  competitors: [competitorSchema],

  name: {

    type: String,
    trim: true,
    maxlength: 128

  },
  description: {
    type: String,
    trim: true
  },
  start_at: {
    type: Date,
    required: true
  }
});


sportEventSchema.statics = {


  async getWeekEvents(competitionId) {
    try {
      let events;
      if (mongoose.Types.ObjectId.isValid(competitionId)) {
        events = await this.find({competition: {_id: competitionId}}).exec();
      }

      if (events) {
        return events;
      }
      throw new APIError({
        message: "No events found",
        status: httpStatus.NOT_FOUND
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = mongoose.model('SportEvent', sportEventSchema, 'sport_events');
