const mongoose = require('mongoose');
const httpStatus = require('http-status');
const ApiError = require('../../utils/APIError');
const { Reservation } = require('../../models/reservation.model.js');
const { Broadcast } = require('../../models/broadcast.model.js');
const { omit } = require('lodash');
const User = require('../../models/user.model.js');
const PubSub = require('pubsub-js');
const { ReservationStatus } = require('../../models/reservation.model.new');

exports.get = async (req, res, next) => {
  try {
    const {loggedUser} = req.locals;
    const broadcast = loggedUser.reservations.find(e => e == req.params.id);
    if (!broadcast) {
      throw new ApiError({message: "Reservation not found.", status: 404});
    }

    const reservation = await Broadcast.findOne({_id: broadcast, 'reservations.user' : loggedUser._id}).deepPopulate('event.competition event.competitor business').lean().exec();
    const response = omit(reservation, 'reservations');
    res.json(response);
  } catch (error) {
     next(error);
  }
  //res.json(req.locals.reservation);
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
    const { loggedUser } = req.locals;
    const { userId, broadcastId, _end = 10, _start = 0, _order = 1, _sort = "_id", id_like } = req.query;


    let reservations = {docs: []};

    if (loggedUser.role === 'user') {


      const broadcastsWithReservation = await Broadcast.find({_id: { $in: loggedUser.reservations }, 'reservations.user': loggedUser._id})
        .limit(parseInt(_end - _start))
        .skip(parseInt(_start))
        .lean();
      if (broadcastsWithReservation) {
          reservations.docs = broadcastsWithReservation.map (broadcast => {
            const reservationObj = broadcast.reservations.find(res => res.user.toString() === loggedUser._id.toString());
            return { ...reservationObj, broadcast: omit(broadcast, "reservations")}
          });
      }

      reservations.docs = reservations.docs.sort((a, b) =>
      _order * (new Date(a.created_at)) - (new Date(b.created_at)) );
      reservations.offset = _start;
      reservations.total = loggedUser.reservations.length || 0;
      //  const reservationDoc = broadcastWithReservation.reservations.find(el => el._id.toString() === userReservationIds[i].toString());

    }


    //TODO: Gestire prenotazioni da business (dato un broadcastId)

    res.json(reservations);
  } catch (error) {
    next(error);
  }
};


exports.checkout = async(req, res, next) => {
  const container = req.app.get('container');
  const reservationService = container.get('reservationService');

  try {
    const reservation = await reservationService.findById(req.query.reservationId);
    if (!reservation) {
      throw new ApiError({message: "Check-In not found.", status: 404});
    }

    await reservationService.checkout(reservation);

    res.status(httpStatus.OK);
    res.json(reservation);
  } catch (error) {
    next(error);
  }
};
