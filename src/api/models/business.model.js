const mongoose = require('mongoose');
const uuidv1 = require('uuid/v1');

const mongoosePaginate = require('mongoose-paginate');
const sizeOf = require('image-size');
const mime = require('mime-to-extensions');

const addressSchema = require('./address.schema');
const { imageVersionSchema } = require('./imageVersion');
const { difference, omit } = require('lodash');
const { googleMapsClient } = require('../utils/google');

const { s3WebsiteEndpoint } = require('../../config/vars');
const { uploadImage, emptyDir } = require('../utils/amazon.js');

const { pagination } = require('../utils/aggregations');

const imageSizes = [
  { width: 640, height: 350 },
  { width: 768, height: 432 },
  { width: 320, height: 180 },
];

const types = [
  'Pub', 'Pizzeria', 'Ristorante',
  'Trattoria', 'Bar', 'Centro scommesse',
];
const providers = [
  { id: "sky", name: "Sky" },
  { id: "mediaset-premium", name: "Mediaset Premium" },
  { id: "dazn", name: "DAZN" },
  { id: "digitale-terrestre", name: "Digitale Terrestre" },
];
//Gli orari dei apertura e chiusura possono essere al massimo 2
const businessHoursSchema = new mongoose.Schema({
  openings: Number,
  open: [{ type: Number, min: 0, max: 1440 }],
  close: [{ type: Number, min: 0, max: 1440 }]

});
//I giorni della settimana sono numeri da 0 a 6 (0 lunedi, 6 domenica)
const businessDaysSchema = new mongoose.Schema({
  mon: businessHoursSchema,
  tue: businessHoursSchema,
  wed: businessHoursSchema,
  thu: businessHoursSchema,
  fri: businessHoursSchema,
  sat: businessHoursSchema,
  sun: businessHoursSchema,
});
/*
businessHours =  {
  mon: { openings: 2, open: [540, 960], close: [780, 1440] },
  //Lunedì apre alle 9 (540) e chiude alle 13 (780). Poi riapre alle 16 (960) e chiude alle 24 (1440)
  thu: { openings: 1, open: [540], close: [1440] },
  // Martedì ha una sola apertura e chiusurua, dalle 9 alle 24
  wen: false,
  // Mercoledì è chiuso
}
*/

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
  pictures: [[imageVersionSchema]],
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
businessSchema.post('remove', function(next) {
  emptyDir(`/images/businesses/${this._id.toString()}/`);
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
  transform(fieldsToOmit = []) {
    const transformed = {};
    let fields = difference(['_id',
      'name',
      'address',
      'type',
      'phone',
      "wifi",
      "seats",
      "vat",
      "spots",
      "user",
      "forFamilies",
      "target",
      "tvs",
      "cover_versions",
      "providers",
      "businessHours","tradeName"], fieldsToOmit);
    //Solo il proprietario può vedere tutte le info del locale



    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
  async uploadCover(file) {
    const ext = mime.extension(file.mimetype);

    try {
      const coverId = uuidv1();
      //Cancello prima tutta la cartella
      await emptyDir(`images/businesses/${this._id.toString()}/`);
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


  async findNear(lat, lng, radius, options = {}, extraAggregations = []) {


    let {_end = 10, _start = 0, _order = 1, _sort = "dist.calculated"} = options;
    radius = parseFloat(radius) * 1000; //km to meters
    lat = parseFloat(lat); lng = parseFloat(lng);


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
      ...extraAggregations ,
      ...pagination({
        skip: _start,
        limit: _end - _start,
        sort: {field: _sort, order: _order}
      })



    ];
    if (options.q) {
      aggregations.splice(1, 0, { $match: { name: { "$regex": options.q, "$options": "i"} } });
    }

    const result = await this.aggregate(aggregations);
    return result.length === 1 ? omit(result[0], "_id") : {docs: [], total: 0};

  }
};
businessSchema.index({ 'address.location': '2dsphere'});
businessSchema.plugin(mongoosePaginate);
exports.Business = mongoose.model('Business', businessSchema, "businesses");
exports.businessSchema = businessSchema;
