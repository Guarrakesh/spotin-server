const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const { omit } = require('lodash');
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const moment = require('moment');
const APIError = require('../utils/APIError');
const httpStatus = require('http-status');
const { reservationSchema } = require('./reservation.model');
const { pagination } = require('../utils/aggregations');
const { imageVersionSchema } = require('./image');
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
  bundle: { ref: 'BroadcastBundle', type: mongoose.Schema.ObjectId },

}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

/* broadcastSchema.method({
 }); */

broadcastSchema.pre('save', function (next) {
  const self = this;

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

broadcastSchema.methods = {
  async review(userId, reservationId, review) {
    this.reservations = this.reservations.map(reservation => {
      if (reservation._id.toString() === reservationId.toString()) {
        reservation.review = review;
      }
      return reservation;
    });
    return await this.save();

  },
};
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


    let results = await this.aggregate([
        /* Il problema è in questi primi 3 stage, dove bisogna stabilire il criterio per prendere i businesses */
      { $group: {
        _id: "$event", numOfBusinesses: { $sum: 1 },
        broadcast: { $push: "$$ROOT"}
      }},
      { $unwind: "$broadcast"},
      { $replaceRoot: { newRoot: "$broadcast"}},
      { $match: filterQuery },
      {
        $lookup: {
          from: 'businesses',
          let: { businessId: '$business' },
          as: 'business',
          pipeline: [
            {
              $geoNear: {
                near: {type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)]},
                distanceField: 'dist.calculated',
                distanceMultiplier: 1 / 1000, // meters to km
                spherical: true,
                maxDistance: radius,
                includeLocs: 'dist.location',
              },
            },
            { $match: { $expr: { $eq: ["$_id", "$$businessId" ] } } } ,
            { $project: { _id: 1, dist: 1, name: 1 }},
          ]
        }
      },
      {$unwind: '$business' },
      { $sort: { 'business.dist.calculated': 1 } },
      { $addFields: {
        business: "$business._id",
        distance: "$business.dist"
      }},
      ...pagination({
        skip: _start,
        limit: _end - _start,
       // sort: { field: 'data.start_at', order: 1 },
      }),
    ]);
    if (results.length === 0) return { docs: [], total: 0, near: {} };
    results[0].near = results[0].docs.reduce((acc, obj) => ({
        ...acc,
        [obj._id]: obj.distance
    }), {});
    return results[0];
  }



};

broadcastSchema.plugin(mongoosePaginate);
broadcastSchema.plugin(deepPopulate, {
  populate: {
    event: { select: ['name', 'competitors', 'competition', 'start_at', 'sport'] },
    business: { select: ['name', 'address', 'cover_versions', 'photos', 'type'] },
  },
});

exports.broadcastSchema = broadcastSchema;
exports.Broadcast = mongoose.model('Broadcast', broadcastSchema, 'broadcasts');
