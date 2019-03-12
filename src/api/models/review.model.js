const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const broadcastReviewSchema = new mongoose.Schema({
  broadcast: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Broadcast'
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SportEvent',
  },
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  answers: [new mongoose.Schema({
    questionId: mongoose.Schema.Types.ObjectId,
    questionMultiplier: Number,
    questionText: String,
    answerId: mongoose.Schema.Types.ObjectId,
    answerText: String,
    answerValue: Number,
  })],
  personalRating: Number,
  rating: Number,
  personalNotes: String,




}, { timestamps: true });

broadcastReviewSchema.statics = {
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

broadcastReviewSchema.methods = {
  async calculateRating() {

  }
};

broadcastReviewSchema.createIndex({ business: 1 });

broadcastReviewSchema.plugin(mongoosePaginate);
exports.BroadcastReview = mongoose.model('BroadcastReview', broadcastReviewSchema, 'broadcastreviews');
exports.BroadcastReviewSchema = broadcastReviewSchema;
