const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const uuidv4 = require('uuid/v4');
const APIError = require('../utils/APIError');
const { env, jwtSecret, jwtExpirationInterval } = require('../../config/vars');


const addressSchema = require('./address.schema');
const { imageVersionSchema } = require('./imageVersion');

const types = [
  'Pub', 'Pizzeria', 'Ristorante',
  'Trattoria', 'Bar', 'Centro scommesse'
];
const providers = [
  "Sky", "Mediaset Premium", "DAZN", "Digitale Terrestre"
];
//Gli orari dei apertura e chiusura possono essere al massimo 2
const businessHoursSchema = new mongoose.Schema({
  opening1: {type: String, required: true},
  opening2: String,
  closing1: {type: String, required: true},
  closing2: String
});
//I giorni della settimana sono numeri da 0 a 6 (0 lunedi, 6 domenica)
const businessDaysSchema = new mongoose.Schema({
  closingDay: [Number],
  hours: [businessHoursSchema]
});

const businessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: addressSchema,
  type: {
    type: String,
    enum: types,
    required: true
  },
  phone: {
    required: true,
    type: String
  },
  wifi: Boolean,
  seats: Number,
  forFamilies: Boolean,
  target: [String],
  tvs: Number,

  providers: {
    type: [{type: String, enum: providers}],
    required: true,
  },
  businessHours: businessDaysSchema,
  cover: imageVersionSchema,
  photos: [imageVersionSchema],

  vat: {
    required: true,
    type: Number,
    trim: true,
  },
  tradeName: {
    //required: true,
    type: Number,
    trum: true
  }

});

exports.Business = mongoose.model('Business', businessSchema, "businesses");
exports.businessSchema = businessSchema;
