const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const offeredAnswerSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});
const broadcastReviewQuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  multiplier: {
    type: Number,
    default: 1,
  },
  offeredAnswers: {
    type: [offeredAnswerSchema],
    required: true,
  },
  order: {
    type: Number,
    default: 1,
  },
});



broadcastReviewQuestionSchema.plugin(mongoosePaginate);

exports.BroadcastReviewQuestion = mongoose.model('BroadcastReviewQuestion', broadcastReviewQuestionSchema, 'broadcastreviews.questions')
exports.broadcastReviewQuestionSchema = broadcastReviewQuestionSchema;

