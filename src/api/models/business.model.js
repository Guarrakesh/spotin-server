const mongoose = require('mongoose');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');

const APIError = require('../utils/APIError');
const mongoosePaginate = require('mongoose-paginate');


const addressSchema = require('./address.schema');
const { imageVersionSchema } = require('./imageVersion');

const types = [
  'Pub', 'Pizzeria', 'Ristorante',
  'Trattoria', 'Bar', 'Centro scommesse'
];
const providers = [
  {id: "sky", name: "Sky"},
  {id: "mediaset-premium", name:"Mediaset Premium"},
  {id: "dazn", name: "DAZN"},
  {id: "digitale-terrestre", name: "Digitale Terrestre"},
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
    trim: true,
    maxLength: 45,
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
  target: String,
  tvs: Number,

  providers: {
    type: [String],
    required: true
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
    type: String,
    trim: true
  },

  spots: {
    type: Number,
    required: true,
    default: 0,
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }

});

businessSchema.plugin(mongoosePaginate);
exports.Business = mongoose.model('Business', businessSchema, "businesses");
exports.businessSchema = businessSchema;
