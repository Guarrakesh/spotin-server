const httpStatus = require('http-status');
const { omit } = require('lodash');
const { Broadcast } = require('../../models/broadcast.model');
const { handler: errorHandler } = require('../../middlewares/error');
const ApiError = require('../../utils/APIError');
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


exports.create = async (req, res, next) => {
  try {
    const { reservationId, userId } = req.body;
    const broadcast = await Broadcast.findOne({
      'reservations._id': reservationId
    });

    if (!broadcast) {
      next(new ApiError({status: httpStatus.BAD_REQUEST}));
    }
    const review = omit(req.body, ['reservationId', 'userId']);
    await broadcast.review(userId, reservationId, review);
    const reservation = broadcast.reservations.find(r => r.id === reservationId)
    res.status(httpStatus.CREATED);
    res.json(reservation);
  } catch (e) {
    next(e);
  }
}
