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


broadcastReviewSchema.createIndex({ business: 1 });

broadcastReviewSchema.plugin(mongoosePaginate);
exports.BroadcastReview = mongoose.model('BroadcastReview', broadcastReviewSchema, 'broadcastreviews');
exports.BroadcastReviewSchema = broadcastReviewSchema;
