const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const { BroadcastReviewQuestion } = require('./review-question.model');;

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

broadcastReviewSchema.pre('save', async function() {
  try {
    const questionIds = this.answers.map(ans => ans.questionId);
    let questions = await BroadcastReviewQuestion.find({_id: {$in: questionIds}}).sort({order: 1}).exec();
    for (const answer of this.answers) {
      const question = questions.find(q => q.id === answer.questionId);
      const dbAnswer = question.offeredAnswers.find(a => a.id === answer.answerId);

      answer.questionText = question.text;
      answer.questionMultiplier = question.multiplier;
      answer.answerText = dbAnswer.text;
      answer.answerValue = dbAnswer.value;
    }
    await this.calculateRating();
    return next();
  } catch (error) {
    next(error);
  }

});
broadcastReviewSchema.methods = {
  /**
   * Calcola il punteggio della recensione da 1 a 5
   */
  async calculateRating() {
    const weightSum = this.answers.reduce((acc, ans) => acc + ans.questionMultiplier, 0);

    const personalRatingWeight = 1;
    const personalRating = personalRatingWeight * this.personalRating; // Il voto personale è pesato con 1 (neutro)
    // Ogni domanda ha un suo peso, per cui effettuo una media pesata sui punteggi delle risposte
    this.rating = this.answers.reduce((acc, ans) =>
      acc + (ans.questionMultiplier * Math.min(Math.max(ans.answerValue,1), 5))// Faccio clamping tra 1 e 5 e sommo
    , personalRating) / (weightSum + personalRatingWeight);

  }
};

broadcastReviewSchema.index({ businessId: 1 });

broadcastReviewSchema.plugin(mongoosePaginate);
exports.BroadcastReview = mongoose.model('BroadcastReview', broadcastReviewSchema, 'broadcastreviews');
exports.BroadcastReviewSchema = broadcastReviewSchema;
