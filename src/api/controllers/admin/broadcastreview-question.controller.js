const httpStatus = require('http-status');
const { handler: errorHandler } = require('../../middlewares/error');
const ApiError = require('../../utils/APIError');
const { BroadcastReviewQuestion } = require('../../models/review-question.model');

exports.load = async (req, res, next, id) => {
  try {
    const reviewQuestion = await BroadcastReviewQuestion.findById(id);
    req.locals = { reviewQuestion };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};


exports.get = (req, res) => res.json(req.locals.reviewQuestion);

exports.list = async(req, res, next) => {
  try {
    const reviewQuestions = await BroadcastReviewQuestion.find(req.query);
    res.json(reviewQuestions);
  } catch (e) {
    next(e);
  }
};

exports.create = async(req, res, next) => {
  try {
    const question = new BroadcastReviewQuestion(req.body);
    const saved = await question.save();
    res.status = httpStatus.CREATED;
    res.json(saved);
  } catch(error) {
    next(error);
  }
};
