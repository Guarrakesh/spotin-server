// @flow
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const sizeOf = require('image-size');
const mime = require('mime-to-extensions');

const { SportEvent } = require('./sportevent.model');
const addressSchema = require('./address.schema');
const { imageVersionSchema, imageSchema } = require('./image');
const { difference, omit, intersection } = require('lodash');
const { googleMapsClient } = require('../utils/google');

const { s3WebsiteEndpoint } = require('../../config/vars');
const amazon = require("../utils/amazon");

const { pagination } = require('../utils/aggregations');
const offerSchema = require('../models/offer.schema');

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
  { id: "dazn-business", name: "DAZN Business" },
  { id: "dazn", name: "DAZN" },
  { id: "digitale-terrestre", name: "Digitale Terrestre" },
];
//Gli orari dei apertura e chiusura possono essere al massimo 2
const businessHoursSchema = new mongoose.Schema({
  openings: [new mongoose.Schema({
    open: { type: Number, min: 0, max: 1440 },
    close: { type: Number, min: 0, max: 2800 },

  }, { _id: false })],
  crossing_day_close: { type: Number },// 0-1440 Se chiude il giorno dopo (es aperto dalle 18:00 alle 02:00)



}, { _id: false });
//I giorni della settimana sono numeri da 0 a 6 (0 lunedi, 6 domenica)
const businessDaysSchema = new mongoose.Schema({
  0: businessHoursSchema,
  1: businessHoursSchema,
  2: businessHoursSchema,
  3: businessHoursSchema,
  4: businessHoursSchema,
  5: businessHoursSchema,
  6: businessHoursSchema,
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
  business_hours: businessDaysSchema,
  // photos: [imageVersionSchema],

  vat: {
    required: true,
    type: Number,
    trim: true,
  },
  tradeName: {
    // required: true,
    type: String,
    trim: true
  },

  spots: {
    type: Number,
    required: true,
    default: 0,
  },
  cover_versions: [imageVersionSchema],
  pictures: [imageSchema],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  offers: [offerSchema],

  quickerMenuURL: String,
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });



businessSchema.pre('save', async function(next) {
  try {


    if (this.modifiedPaths().includes('address') || (this.isNew && this.address)) {
      //Uno o piu campi dell'indirizzo sono cambiati, eseguo geocoding
      const { address } = this;
      const compactAddress = `${address.street} ${address.number}, ${address.zip} ${address.city}, ${address.province}`;

      return googleMapsClient.geocode({address: compactAddress}).asPromise()
          .then(res => {

            const response = res.json;
            if (response && response.results && response.results.length > 0) {
              const {location} = response.results[0].geometry;
              this.address.location = {
                type: 'Point',
                coordinates: [location.lng, location.lat]
              }
            }
            return next();
          })
          .catch(err => {
            return next(err);
          });
    } else { return next() }
  } catch (err) {
    return next(err);
  }
});
businessSchema.post('remove', function(next) {
  amazon.emptyDir(`/images/businesses/${this._id.toString()}/`);
});

businessSchema.methods = {
  async paySpots(spots) {

    if (this.spots < spots) {
      throw Error("Not enough spots to pay " + spots + " spots");
    }
    try {
      this.spots -= spots;
    } catch (error) {
      throw Error(error);
    }
  },
  async canBroadcastBundle(bundle) {
    return true;
    
    for (const broadcast of bundle.broadcasts) {
      const event = await SportEvent.findById(broadcast.event.id);
      if (!this.canBroadcastEvent(event))
        return false;
    }
    return true;
  },
  async canBroadcastEvent(event) {
    return true;
    return this.spots > event.spots;
  },
  s3Path() {
    return `images/businesses/${this._id.toString()}`;
  },


  isNowOpen() {
    const today = new Date();
    let day = (today.getDay() - 1) % 7;
    if (day === -1) day = 6;
    if (this.business_hours && this.business_hours[day]) {

      const currentDay = this.business_hours[day];
      const minutes = today.getHours() * 60;
      console.log(minutes);
      return !!currentDay.openings.find(o => minutes > o.opening && minutes < o.close);
    }
    return false;

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
      "pictures",
      "created_at",
      "updated_at",
      "business_hours", "tradeName",
      "quickerMenuURL"], fieldsToOmit);
    //Solo il proprietario può vedere tutte le info del locale


    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
  async uploadCover(file) {

    const ext = mime.extension(file.mimetype);
    try {


      await amazon.deleteObject(`${this.s3Path()}/cover.jpeg`)
      //await amazon.emptyDir(`images/businesses/${this._id.toString()}/`);
      const data = await amazon.uploadImage(file.buffer, `images/businesses/${this._id.toString()}/cover.${ext}`);
      const {width, height} = await sizeOf(file.buffer);
      //Image_versions non viene pushato perché quando cambia l'immagine, quella precedente deve venire cancellata
      this.cover_versions = [{url: data.Location, width, height, ext}];


      const basePath = `${s3WebsiteEndpoint}/${this.s3Path()}`;
      const fileName = "cover." + ext;
      this.cover_versions.concat(this.constructor.makeImageVersions(basePath, fileName));
      await this.save();
      //await this.update({_id: savedComp._id}, { $set: {image_versions: [{url: data.Location, width, height}] }}).exec();
    } catch (error) {
      console.log(error);
      throw Error(error);
    }

  },

  async removePicture(picture) {
    if (!this.pictures) return;

    const pic = this.pictures.find(pic => pic.id === picture.id);
    if (pic) {
      await amazon.deleteObject(`${this.s3Path()}/${pic.id}/${pic.ext}`);
      await this.update({_id: this._id}, {$pull: {'pictures': {id: pic.id}}});

    }
  },
  async uploadPicture(file) {
    const ext = mime.extension(file.mimetype);

    const _id = new mongoose.Types.ObjectId();
    const basePath = `${s3WebsiteEndpoint}/${this.s3Path()}`;
    const fileName = `picture_${_id.toString()}.${ext}`;

    const data = await amazon.uploadImage(
        file.buffer,
        `images/businesses/${this._id.toString()}/picture_${_id.toString()}.${ext}`,
        {
          Metadata: {
            'X-ObjectId': _id.toString(),
          },
        }
    );

    const {width, height} = await sizeOf(file.buffer);
    const versions = [{url: data.Location, width, height}]
        .concat(this.constructor.makeImageVersions(basePath, fileName));
    this.pictures.push({_id, versions});
  },


  /**
   * Trova gli eventi che il locale può trasmettere (basandosi su provider e orari di lavoro del locale) in un dato periodo di riferimento
   *
   * @param start_at L'inizio del periodo di riferimento (Default all'orario attuale)
   * @param end_at Fine del periodo di riferimento (Default non impostato, quindi non c'è un estremo superiore)
   * @returns {Promise<SportEvent[]>}
   */
  async getBroadcastableEvents(start_at = Date.now(), end_at) {
    const filter = {start_at: {$gte: start_at}};
    if (end_at) {
      filter.start_at["$lte"] = end_at;
    }

    const results = await SportEvent.find(filter).populate('sport').populate('competition').populate('competitors.competitor', ['sport', 'name', 'appealValue']);

    const events = results
        .filter((event) => this.isEventBroadcastable(event));

    return events;

  },

  checkSupportsProviders(providers) {
    return intersection(providers, this.providers).length > 0;
  },
  isEventBroadcastable(event) {


    if (process.env.NODE_ENV !== "test") {
      if (!this.business_hours) {
        throw Error('No business hours for this business');
      }
    }
    let weekDay = (new Date(event.start_at).getDay() - 1) % 7;

    if (weekDay === -1) weekDay = 6;

    if (this.business_hours[weekDay] && this.business_hours[weekDay].openings.length > 0) {
      const day = this.business_hours[weekDay];
      const eventStart = event.start_at.getHours() * 60 + event.start_at.getMinutes(); //between 0 and 1440
      let approximatedEventEnd = eventStart + event.sport.duration;

      //Controllo se l'evento rientra negli orari di apertura
      const found = day.openings.find(o => (eventStart >= o.open && approximatedEventEnd <= o.close) ||
          (eventStart >= o.open && o.close === 0 && (approximatedEventEnd <= 1440)) ||  //Finisce prima di/a mezzanotte
          (eventStart >= o.open && day.crossing_day_close && (approximatedEventEnd <= 1440) && approximatedEventEnd - 1440 < day.crossing_day_close)
      );
      if (found) {
        return this.checkSupportsProviders(event.providers);
      } else {
         const prevDay = this.business_hours[(weekDay + 6) % 7];
        // L'evento inizia dopo la mezzanotte e rientra negli orari di chiusura
        if (approximatedEventEnd >= 1440)
          approximatedEventEnd -= 1440;

        if (prevDay && prevDay.crossing_day_close && (approximatedEventEnd) <= prevDay.crossing_day_close) {
          return this.checkSupportsProviders(event.providers)
        }
      }

    }
    return false;
    //   for (let i = 0; i < day.open.length; i++) {
    //
    //     if (day.close[i] && eventStart >= day.open[i] && approximatedEventEnd <= day.close[i]) {
    //       return this.checkSupportsProviders(event.providers);
    //
    //     } else {
    //       //Se l'evento non entra in alcuna fascia oraria
    //       //Controllo ulteriormente se inizia in un giorno e finisce in un altro
    //       if ((day.crossing_day_close && eventStart >= day.open[day.openings-1] && approximatedEventEnd <= 1440 + day.crossing_day_close)) {
    //         //L'ultima chiusura è il giorno dopo (es dalle 18:00 alle 02:00)
    //         // Il primo orario di chiusura corrisponde alla chiusura del giorno prima
    //         return this.checkSupportsProviders(event.providers);
    //       } else {
    //         const prevDay = this.business_hours[(weekDay + 6) % 7];
    //         if (prevDay && prevDay.crossing_day_close && approximatedEventEnd <= prevDay.crossing_day_close) {
    //           return this.checkSupportsProviders(event.providers);
    //         }
    //       }
    //     }
    //   }
    // }
    // return false;

  }
};
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

  },
  makeImageVersions(basePath, fileName) {

    const _basePath = basePath.replace(/^\/|\/$/g, ''); // Rimuovi i trailing e leading slash
    const _fileName = fileName.replace(/^\/|\/$/g, '');

    const versions = [];
    imageSizes.forEach(({ width, height }) => {
      versions.push({
        url: `${_basePath}/${width}x${height}/${_fileName}`,
        width,
        height
      });
    });
    return versions;
  }

};
businessSchema.index({ 'address.location': '2dsphere'});
businessSchema.plugin(mongoosePaginate);
exports.Business = mongoose.model('Business', businessSchema, "businesses");
exports.businessSchema = businessSchema;
exports.imageSizes = imageSizes;
exports.businessTypes = types;