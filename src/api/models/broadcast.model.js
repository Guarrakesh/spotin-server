const mongoose = require('mongoose');

const { imageVersionSchema } = require('./imageVersion');

const offerSchema = require('./offer.schema');


const reservationSchema = new mongoose.Schema({
  user_id: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  date: Date
});


const broadcastSchema = new mongoose.Schema({

  business_id: {
    ref: "Business",
    type: mongoose.Schema.ObjectId,
  },
  event_id: {
    ref: "SportEvent",
    type: mongoose.Schema.ObjectId
  },
  //Indica se la trasmissione è presente nella bacheca offerta. 0 Vuol dire non presente.
  //Piu' alto è il numero, piu la trasmissione ha priorità sulle altre
  newsfeed: {
    type: Number,
    default: 0,
  },
  image_url: imageVersionSchema,
  offer: offerSchema,
  reservations: [reservationSchema],

  start_at: Date,
  end_at: Date,

});

broadcastSchema.method({
  transform(req) {
    const transformed = {};

  }
})
exports.broadcastSchema = broadcastSchema;
exports.Broadcast = mongoose.model("Broadcast", broadcastSchema, "broadcasts");



