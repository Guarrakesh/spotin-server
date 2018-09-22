const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const {reservationSchema} = require('./reservation.model');

const { imageVersionSchema } = require('./imageVersion');

const offerSchema = require('./offer.schema');




const broadcastSchema = new mongoose.Schema({

  business: {
    ref: "Business",
    type: mongoose.Schema.ObjectId,
  },
  event: {
    ref: "SportEvent",
    type: mongoose.Schema.ObjectId
  },
  //Indica se la trasmissione è presente nella bacheca offerta. 0 Vuol dire non presente.
  //Piu' alto è il numero, piu la trasmissione ha priorità sulle altre
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

broadcastSchema.method({
  transform(req) {
    const transformed = {};

  }
});

broadcastSchema.statics = {
  /**
   * Get broadcast
   *
   * @param {ObjectId} id - The objectId of broadcast.
   * @returns {Promise<User, APIError>}
   */
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
};

broadcastSchema.plugin(mongoosePaginate);
exports.broadcastSchema = broadcastSchema;
exports.Broadcast = mongoose.model("Broadcast", broadcastSchema, "broadcasts");
