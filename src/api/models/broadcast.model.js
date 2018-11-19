const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const { omit } = require('lodash');
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const moment = require('moment');
const APIError = require('../utils/APIError');
const httpStatus = require('http-status');
const { reservationSchema } = require('./reservation.model');
const { pagination } = require('../utils/aggregations');
const { imageVersionSchema } = require('./imageVersion');
const offerSchema = require('./offer.schema');
const { SportEvent } = require('./sportevent.model');


const broadcastSchema = new mongoose.Schema({

  business: {
    ref: 'Business',
    type: mongoose.Schema.ObjectId,
  },
  event: {
    ref: 'SportEvent',
    type: mongoose.Schema.ObjectId
  },

  // Indica se la trasmissione è presente nella bacheca offerta. 0 Vuol dire non presente.
  // Piu' alto è il numero, piu la trasmissione ha priorità sulle altre
  newsfeed: {
    type: Number,
    default: 0,
  },
  image_url: [imageVersionSchema],
  offer: offerSchema,
  reservations: [reservationSchema],

  start_at: Date,
  end_at: Date,

});

/* broadcastSchema.method({
 }); */

broadcastSchema.pre('save', function (next) {
  const self = this;

  if (this.plus === true) {
    this.newsfeed = 1;
  } else {
    this.newsfeed = 0;
  }
  SportEvent.findById(this.event).exec((err, event) => {
    if (err) return next();
    if (!self.start_at) {
      self.start_at = moment(event.start_at).subtract(10, 'days').startOf('day').toDate();
    }
    if (!self.end_at) {
      self.end_at = moment(event.start_at).add(3, 'hours').toDate();
    }
    next();
  });
});
broadcastSchema.statics = {
  /**
   * Get broadcast
   *
   * @param {ObjectId} id - The objectId of broadcast.
   * @returns {Promise<User, APIError>}
   */
  calculateSpots(offer, event, isPlus) {

    if (!event || typeof offer !== 'object') {
      throw new Error('Invalid parameters to calculate spots.');
    }

    let totalSpots = event.spots;
    if (isPlus) {
      totalSpots += 150;
    }

    return totalSpots;

  },
  async get(id) {
    try {
      let broadcast;

      if (mongoose.Types.ObjectId.isValid(id)) {
        broadcast = await this.findById(id).exec();
      }
      if (broadcast) {
        return broadcast;
      }

      throw new APIError({
        message: 'Brodcast does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },

  async listNear(options) {
    let filterQuery = omit(options, ['latitude', 'longitude', 'radius', '_end', '_sort', '_order', '_start']);
    const { _end = 10, _start = 0, _order = 1, _sort = 'start_at' } = options;
    const { latitude, longitude, radius } = options;
    const now = moment().toDate();
    filterQuery = {
      ...filterQuery,
      end_at: { $gte: now },
      start_at: { $lte: now },
    };

    console.log(filterQuery);
    const results = await this.aggregate([

      { $match: filterQuery },
      {

        $lookup: {
          from: 'businesses',
          let: { businessId: '$business'},
          as: 'business',
          pipeline: [

            {

              $geoNear: {
                near: {type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)]},
                distanceField: 'dist.calculated',
                distanceMultiplier: 1 / 1000, // meters to km
                spherical: true,
                maxDistance: (radius),
                includeLocs: 'dist.location',
              },
            },
            { $match: { $expr: { $eq: ['$_id', '$$businessId' ] } } } ,
            { $project: { _id: 1, dist: 1, name: 1 }},
          ]
        }
      },
      {$unwind: '$business' },
      { $sort: { 'business.dist.calculated': 1 } },
      { $group: { _id: '$business._id', data: { $addToSet: '$$ROOT' } } },
      ...pagination({
        skip: _start,
        limit: _end - _start,
        sort: { field: 'data.start_at', order: 1 },
      }),
    ]);

    return results;
  }
}

broadcastSchema.plugin(mongoosePaginate);
broadcastSchema.plugin(deepPopulate, {
  populate: {
    event: { select: ['name', 'competitors', 'competition', 'start_at', 'sport'] },
    business: { select: ['name', 'address', 'cover_versions', 'photos', 'type'] },
  },
});

exports.broadcastSchema = broadcastSchema;
exports.Broadcast = mongoose.model('Broadcast', broadcastSchema, 'broadcasts');
