const mongoose = require('mongoose');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');

const APIError = require('../utils/APIError');
const mongoosePaginate = require('mongoose-paginate');


const addressSchema = require('./address.schema');
const { imageVersionSchema } = require('./imageVersion');
const { intersection } = require('lodash');
const { googleMapsClient } = require('../utils/google');

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
    type: [{
      type: String,
      enum: types,
    }],

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

businessSchema.pre('save', async function(next) {
  try {


    if (this.modifiedPaths().includes('address') || this.isNew) {
      //Uno o piu campi dell'indirizzo sono cambiati, eseguo geocoding
      const { address } = this;
      const compactAddress = `${address.street} ${address.number}, ${address.zip} ${address.city}, ${address.province}`;

      return googleMapsClient.geocode({address: compactAddress}).asPromise()
        .then(res => {
          const response = res.json;
          if (response.results.length > 0) {
            const {location} = response.results[0].geometry;
            this.address.location = {
                type: 'Point',
                coordinates: [location.lng, location.lat]
              }

            console.log(this.address);

          }
          next();
        })
        .catch(err => {
          next(err);
        })


    } else { return next() }
  } catch (err) {

    return next(err);
  }
});


businessSchema.method({
  async paySpots(spots) {
    this.spots -= spots;
    await this.save();
  },
});
businessSchema.statics = {
  async findNear(lat, lng, radius, options = {}) {

    let {_end = 10, _start = 0, _order = -1, _sort = "dist.calculated"} = options;
    radius = parseFloat(radius) * 1000; //km to meters
    lat = parseFloat(lat); lng = parseFloat(lng);
    const count = await this.count({'address.location': {
      $near: {$maxDistance: radius, $geometry: {type: 'Point', coordinates: [lng, lat]}}
    }}).exec();

    _sort = _sort == "distance" ? "dist.calculated" : _sort; //accetto anche distance come parametro di _sort
    const docs = await this.aggregate([
      {
        '$geoNear': {
          near: {type: 'Point', coordinates: [(lng), (lat)]},
          distanceField: "dist.calculated",
          distanceMultiplier: 1/1000, //meters to km
          spherical: true,
          maxDistance: (radius),
          includeLocs: "dist.location",
        },
      },
      { $sort: { [_sort]: parseFloat(_order) }},
      { $skip: parseInt(_start) },
      { $limit: parseInt(_end - _start)},



    ]);

    return {
      docs,
      total: count,
      offset: _start,
    }
  }
};
businessSchema.index({ 'address.location': '2dsphere'});
businessSchema.plugin(mongoosePaginate);
exports.Business = mongoose.model('Business', businessSchema, "businesses");
exports.businessSchema = businessSchema;
