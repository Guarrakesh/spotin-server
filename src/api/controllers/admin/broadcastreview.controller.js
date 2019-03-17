const { handler: errorHandler } = require('../../middlewares/error');
const ApiError = require('../../utils/APIError');
const { BroadcastReview } = require('../../models/review.model');

exports.load = async (req, res, next, id) => {
  try {
    const review = await BroadcastReview.get(id);
    req.locals = { review };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

exports.get = (req, res) => res.json(req.locals.review);

exports.list = async (req, res, next) => {
  try {
    const reviews = await BroadcastReview.list(req.query);
    res.json(reviews);
  } catch (e) {
    next(e);
  }
};
