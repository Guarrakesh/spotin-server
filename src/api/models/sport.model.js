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
  }
}

module.exports = mongoose.model('Sport', sportSchema, 'sports');
