const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const offeredAnswerSchema = new mongoose.Schema({
  value: Number,
  text: String,
});
const broadcastReviewQuestionSchema = new mongoose.Schema({
  text: String,
  multiplier: Number,
  offeredAnswers: [offeredAnswerSchema],
  order: Number,
});



broadcastReviewQuestionSchema.plugin(mongoosePaginate);

exports.BroadcastReviewQuestion = mongoose.model('BroadcastReviewQuestion', broadcastReviewQuestionSchema, 'broadcastreviews.questions')
exports.broadcastReviewQuestionSchema = broadcastReviewQuestionSchema;

