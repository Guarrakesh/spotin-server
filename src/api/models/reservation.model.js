const mongoose = require('mongoose');
const httpStatus = require('http-status');

const { omitBy, isNil, pick} = require('lodash');
const { pagination } = require('../utils/aggregations');
const { broadcastReviewSchema } = require('./review.model');
const moment = require('moment');

const { NewReservation } = require('./reservation.model.new');

const reservationSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  },
  broadcast: {
    type: mongoose.Schema.ObjectId,
    ref: "Broadcast"
  },

  review: broadcastReviewSchema,
  created_at: Date,

  // Imposto come oggetto perché in futuro avremo una lista di utenti nella prenotazione
  cheers: [new mongoose.Schema({
    userId: mongoose.Schema.ObjectId,
    /**
     * Se sono squadre, in cheerFor va "__home__" o "__guest__" oppure l'id della squadra
     * Se non sono squadre, può andare qualsiasi valore (eg. nome del pilota)
     */
    cheerFor: {
      type: String
    }
  }, { _id: false })],
  used: {
    type: Boolean,
    default: false,
    required: true,
  },
  peopleNum: Number,

}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});

const finalAggregationStages = [
  { $unwind: "$reservations"},
  { $addFields: {
      broadcast: "$$ROOT",
      peopleNum: "$reservations.peopleNum",
      user: "$reservations.user",
      used: "$reservations.used",
      created_at: "$reservations.created_at",
      _id: "$reservations._id",
      review: "$reservations.review",
    },
  },
  { $project: {
      "broadcast.start_at": 0,
      "broadcast.end_at": 0,
      business: 0,
      reservations: 0,
      "broadcast.reservations": 0,
    } }
];


reservationSchema.statics = {


  async list(opts = {}) {

    const {skip = 0, limit = 10, sort, user, broadcast, business, event, id_like, include_past_events = true} = opts;
    const { Broadcast } = require('./broadcast.model');

    const filter = {};

    if (broadcast) filter.broadcast = mongoose.Types.ObjectId(broadcast);
    if (event) filter.event = mongoose.Types.ObjectId(event);
    if (business) filter.business = mongoose.Types.ObjectId(business);
    if (id_like) filter._id = id_like;
    if (user) filter.user = mongoose.Types.ObjectId(user);

    const match = { "reservations.0": { $exists: 1 } };
    if (!include_past_events) match.end_at =  { $gte: moment().toDate() };
    const result = await Broadcast.aggregate([
      { $match: {
          ...match
        } },
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

    ]);
  },
  async findByUserId(id, opts = {}) {
    const options = opts;
    options.user = mongoose.Types.ObjectId(id);
    return await this.list(options);
  },
  async findByBroadcast(id) {
    //TODO
  },

};

reservationSchema.statics.sync = async function(doc, businessId) {

  const result = await NewReservation.create({
    businessId: businessId,
    broadcastId: doc.broadcast,
    userId: doc.user,

    checkedInAt: Date.now(),
    peopleNum: doc.peopleNum,
    status: doc.status,
    review: doc.review,
    cheers: doc.cheers,
    used: doc.used,

  });
  next();


};

exports.reservationSchema = reservationSchema;
exports.Reservation = mongoose.model('Reservation', reservationSchema);
