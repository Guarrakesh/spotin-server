const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const uuidv4 = require('uuid/v4');
const APIError = require('../utils/APIError');
const { env, jwtSecret, jwtExpirationInterval } = require('../../config/vars');
const { imageVersionSchema } = require('./imageVersion');

const {Sport} = require('./sport.model.js');

const competitionSchema = new mongoose.Schema({
  sport: {

      type: mongoose.Schema.Types.ObjectId,
      ref: "Sport"

  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  competitorsHaveLogo: {
    type: Boolean,
    default: true
  },
  country: {
    type: String,
    trim: true,
  },
  image_versions: [imageVersionSchema]
});


competitionSchema.statics = {
  async get(id) {
    try {
      let competition;
      if (mongoose.Types.ObjectId.isValid(id)) {
        competition = await this.findById(id).exec()
      }
      if (competition) {
        return competition;
      }
      throw new APIError({
        message: "Competition does not exist",
        status: httpStatus.NOT_FOUND
      });
    } catch (error) {
      throw error;
    }
  }
}

exports.Competition = mongoose.model('Competition', competitionSchema);
exports.competitionSchema = competitionSchema;
