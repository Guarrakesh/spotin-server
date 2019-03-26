const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const { Broadcast } = require('./broadcast.model');

const broadcastReviewSchema = new mongoose.Schema({
  broadcastId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Broadcast'
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SportEvent',
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  rating: new mongoose.Schema({
    av: Number,
    food: Number,
    price: Number,
    people: Number,
    sub: Number,
  }, { _id: false }),

  comment: String,
  status: {
    type: Number,
    enum: [0,1,-1], // 0 - In attesa di revisione, 1 - Pubblicata, -1 - Rifiutata
    default: 0,
  }




}, { timestamps: true });

broadcastReviewSchema.statics = {
  async get(id) {
    try {
      let broadcastReview;

      if (mongoose.Types.ObjectId.isValid(id)) {
        broadcastReview = await this.findById(id).exec();
      }
      if (broadcastReview) {
        return broadcastReview;
      }

      throw new APIError({
        message: 'BrodcastReview does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },
  async list(options) {
    const { _end = 10, _start = 0, _order = -1, _sort = "createdAt", id_like, q, ...filter } = options;

    if (id_like) filter.id = { $in: id_like.split('|') };
    return await this.paginate(filter, {
      sort: {[_sort]: _order === "DESC" ? -1 : 1},
      offset: parseInt(_start),
      limit: parseInt(_end - _start)
    })
  }
};

broadcastReviewSchema.pre('save', async function(next) {
  try {
    await this.denormalize();
    return next();
  } catch (error) {
    next(error);
  }

});
broadcastReviewSchema.methods = {

  denormalize: async function () {
    const broadcast = await Broadcast.findById(this.broadcastId);
    // Denormalizzo questi due dati per ricavali subito, senza effettuare
    // Lookup inutili. Bisogna stare attenti se si aggiorna il broadcast,
    // ad aggiornare anche questi id. se cambiano.
    this.eventId = broadcast.event;
    this.businessId = broadcast.business;
    return this;
  },



};

broadcastReviewSchema.index({ businessId: 1 });

broadcastReviewSchema.plugin(mongoosePaginate);
exports.BroadcastReview = mongoose.model('BroadcastReview', broadcastReviewSchema, 'broadcastreviews');
exports.BroadcastReviewSchema = broadcastReviewSchema;
