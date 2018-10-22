const mongoose = require('mongoose');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const uuidv1 = require('uuid/v1');
const APIError = require('../utils/APIError');
const mongoosePaginate = require('mongoose-paginate');
const sizeOf = require('image-size');
const mime = require('mime-to-extensions');


const addressSchema = require('./address.schema');
const { imageVersionSchema } = require('./imageVersion');
const { intersection } = require('lodash');
const { googleMapsClient } = require('../utils/google');

const { s3WebsiteEndpoint } = require('../../config/vars');
const { uploadImage } = require('../utils/amazon.js');
const imageSizes = [
  {width: 640, height: 350},
  {width: 768, height: 432},
  {width: 320, height: 180},
];

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
  //photos: [imageVersionSchema],

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
  cover_versions: [imageVersionSchema],
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
  async paySpots(spots, isPlus = false) {
    try {
      this.spots -= spots;
      await this.save();
    } catch (error) {
      throw Error(error);
    }
  },
  async uploadCover(file) {
    const ext = mime.extension(file.mimetype);

    try {
      const coverId = uuidv1();
      const data = await uploadImage(file.buffer, `images/businesses/${this._id.toString()}/cover.${ext}`);
      const {width, height} = await sizeOf(file.buffer);
      //Image_versions non viene pushato perché quando cambia l'immagine, quella precedente deve venire cancellata

      this.cover_versions = [{url: data.Location, width, height}];


      const basePath = s3WebsiteEndpoint + "/images/businesses";

      imageSizes.forEach(({width, height}) => {
        this.cover_versions.push({
          url: `${basePath}/${this._id.toString()}/${width}x${height}/cover.${ext}`,
          width: width,
          height: height
        });

      });
      await this.save();
      //await this.update({_id: savedComp._id}, { $set: {image_versions: [{url: data.Location, width, height}] }}).exec();
    } catch (error) {
      console.log(error);
      throw Error(error);
    }

  }
});
businessSchema.statics = {


  async findNear(lat, lng, radius, options = {}) {

    let {_end = 10, _start = 0, _order = 1, _sort = "dist.calculated"} = options;
    radius = parseFloat(radius) * 1000; //km to meters
    lat = parseFloat(lat); lng = parseFloat(lng);
    const count = await this.count({'address.location': {
      $near: {$maxDistance: radius, $geometry: {type: 'Point', coordinates: [lng, lat]}}
    }, ...options}).exec();

    _sort = _sort == "distance" ? "dist.calculated" : _sort; //accetto anche distance come parametro di _sort

    const aggregations = [
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



    ];
    if (options.q) {
      aggregations.splice(1, 0, { $match: { name: { "$regex": options.q, "$options": "i"} } });
    }

    const docs = await this.aggregate(aggregations);

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
