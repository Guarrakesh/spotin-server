const mongoose = require('mongoose');
const httpStatus = require('http-status');
const ApiError = require('../../utils/APIError');
const { handler: errorHandler } = require('../../middlewares/error');
const bodyParser = require('body-parser');
const { Reservation } = require('../../models/reservation.model.js');
const { Broadcast } = require('../../models/broadcast.model.js');
const { omit } = require('lodash');
const User = require('../../models/user.model.js');

exports.get = async (req, res, next) => {
  try {
    const result = await Broadcast.findOne({
      'reservations._id': req.params.id,
    }, {
      "reservations.$": 1, event: 1, business: 1 }).lean();
    if (result.reservations) {
      return res.json({
        ...result.reservations[0],
        event: result.event,
        business: result.business,
      });
    }
    next(new ApiError({status: 404}))
  } catch (error) {
    next(error);
  }
};
exports.create = async (req, res, next) => {
  try {
    const { user } = req;
    if (!user)
      throw new ApiError({status: 401});
    const { broadcast } = req.body;
    const reservation = new Reservation({
      user: { _id: user._id, name: user.name, lastname: user.lastname, email: user.email },
      broadcast: broadcast,
      created_at: (new Date()).toISOString()
    });

    const updatedBroadcast = await Broadcast.findOneAndUpdate({_id: broadcast},
      { $push: {reservations: reservation}}, );
    //Prendo l'id della reservation generata da mongoose e la pusho nell'oggetto reservations dell'utente

    const updatedUser = await User.findOneAndUpdate({_id: user._id},
      { $push: {reservations: new mongoose.mongo.ObjectId(broadcast)}});

    res.status = httpStatus.CREATED;
    res.json(reservation);

  } catch (e) {
    next(e);
  }
};

exports.list = async (req, res, next) => {
  try {
    const {
      user,
      broadcast,
      event,
      business,
      _end = 10,
      _start = 0,
      _order = 1,
      _sort = "_id",
      id_like } = req.query;

    const options = {
      skip: parseInt(_start, 10),
      limit: parseInt(_end - _start,10),
      sort: {field: _sort, order: _order === "DESC" ? -1 : 1},
      user,
      business,
      broadcast,
      event
    };
    if (id_like)
      options.id_like = { $in: id_like.split('|').map(id => mongoose.Types.ObjectId(id)) } ;

    const reservations = await Reservation.list(options);


    //TODO: Gestire prenotazioni da business (dato un broadcastId)


    res.json(reservations);
  } catch (error) {
    next(error);
  }
};


exports.review = async (req, res, next) => {
  try {
    // L'update accetta solo il cambiamento di status
    const { status } = req.body;
    const updated = await Broadcast.findOneAndUpdate({
          'reservations': {
            $elemMatch: {
              "review._id": mongoose.Types.ObjectId(req.params.reviewId),
              "review.status": 0
            }
          }
        }, {
          $set: { "reservations.$.review.status": status }
        }, { new: true });
    res.json(updated);

  } catch (e) {
    next(e);
  }
};
