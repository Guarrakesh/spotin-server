const mongoose = require('mongoose');
const httpStatus = require('http-status');

const { omitBy, isNil, pick} = require('lodash');
const { pagination } = require('../utils/aggregations');
const reservationSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  },
  broadcast: {
    type: mongoose.Schema.ObjectId,
    ref: "Broadcast"
  },

  created_at: Date,

  used: {
    type: Boolean,
    default: false,
    required: true,
  }


});

const finalAggregationStages = [
  { $unwind: "$reservations"},
  { $addFields: {
    broadcast: "$_id",
    user: "$reservations.user",
    used: "$reservations.used",
    created_at: "$reservations.created_at",
    _id: "$reservations._id"
  }
  },
  { $project: { start_at: 0, end_at: 0, offer: 0, newsfeed: 0, reservations: 0, image_url: 0 } }
];


reservationSchema.statics = {


  async list(opts = {}) {

    const {skip = 0, limit = 10, sort, user, broadcast, business, event, id_like } = opts;
    const { Broadcast } = require('./broadcast.model');

    const filter = {};
    if (broadcast) filter.broadcast = mongoose.Types.ObjectId(broadcast);
    if (event) filter.event = mongoose.Types.ObjectId(event);
    if (business) filter.business = mongoose.Types.ObjectId(business);
    if (id_like) filter._id = id_like;
    if (user) filter.user = mongoose.Types.ObjectId(user);

    const result = await Broadcast.aggregate([
      { $match: { "reservations.0": { $exists: 1 } } },
      ...finalAggregationStages,
      { $match: filter },
      ...pagination({skip, limit, sort}),
    ]);
    return result.length === 1 ? result[0] : {docs: [], total: 0};
  },
  async findById(id) {
    const { Broadcast } = require('./broadcast.model');
    return await Broadcast.aggregate([
      { $match: { "reservations._id": id} },
      ...finalAggregationStages,

    ])
  },
  async findByUserId(id, opts = {}) {
    const options = opts;
    options.user = mongoose.Types.ObjectId(id);
    return await this.list(options);
  },
  async findByBroadcast(id) {
    //TODO
  }
};

exports.reservationSchema = reservationSchema;
exports.Reservation = mongoose.model('Reservation', reservationSchema);
