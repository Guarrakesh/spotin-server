const mongoose = require('mongoose');
const httpStatus = require('http-status');

const { omitBy, isNil, pick} = require('lodash');
const { pagination } = require('../utils/aggregations');
const { broadcastReviewSchema } = require('./review.model');
const moment = require('moment');

const ReservationStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  CANCELED: 'CANCELED'
};
const reservationSchema = new mongoose.Schema({

  businessId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Business',
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  },
  broadcastId: {
    type: mongoose.Schema.ObjectId,
    ref: "Broadcast"
  },

  eventId: {
    type: mongoose.Schema.ObjectId,
    ref: "SportEvent",
  },
  userListIds: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],

  checkedInAt: Date,
  checkedOutAt: Date,
  cancelledAt: Date,


  transactions: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Transaction',
  }],

  ticket: mongoose.Schema.Types.Mixed,

  peopleNum: Number,

  amount: Number,

  status: {
    type: String,
    default: ReservationStatus.PENDING,
    enum: Object.values(ReservationStatus)
  },

  review: broadcastReviewSchema,


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



}, { timestamps: false });



exports.reservationSchema = reservationSchema;
exports.NewReservation = mongoose.model('UserReservation', reservationSchema, 'reservations' );
exports.ReservationStatus = ReservationStatus;
