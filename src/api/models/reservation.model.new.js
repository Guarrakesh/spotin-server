const mongoose = require('mongoose');

const { broadcastReviewSchema } = require('./review.model');

const ReservationStatus = {
  CHECKED_IN: 'CHECKED_IN',
  CHECKING_OUT: 'CHECKING_OUT',
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED', // checked out
  CANCELED: 'CANCELED' // canceled by user

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


  transactionsIds: [{
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

  // @deprecated
  used: {
    type: Boolean,
    default: false,
    required: true,
  },

  spotCoinFactor: {
    type: Number,
    default: process.env.DEFAULT_SPOT_COIN_FACTOR || 0.01,
  }



}, { timestamps: false });



exports.reservationSchema = reservationSchema;
exports.NewReservation = mongoose.model('UserReservation', reservationSchema, 'reservations' );
exports.ReservationStatus = ReservationStatus;
