const mongoose = require('mongoose');
const httpStatus = require('http-status');
const ApiError = require('../utils/APIError');
const { handler: errorHandler } = require('../middlewares/error');
const bodyParser = require('body-parser');
const { Reservation } = require('../models/reservation.model');
const { Broadcast } = require('../models/broadcast.model');
const { omit } = require('lodash');
const User = require('../models/user.model');


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
    console.log(updatedBroadcast);
    const reservationId = updatedBroadcast.reservations[updatedBroadcast.reservations.length-1]._id;

    await User.update({_id: user._id},
      { $push: {reservations: new mongoose.mongo.ObjectId(reservationId)}});


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


    let reservations = {};
    if (loggedUser.role === 'user') {
      const userReservationIds = loggedUser.reservations;
      let userReservations = { docs: [] };
      for (let i = _start; i < userReservationIds.length ; i++) {

        if (i > _end) break;

        const broadcastWithReservation = await Broadcast.findOne({'reservations._id': userReservationIds[i]}).lean();

        if (!broadcastWithReservation) continue;
        const reservationDoc = broadcastWithReservation.reservations.find(el => el._id.toString() === userReservationIds[i].toString());

        console.log(reservationDoc, broadcastWithReservation.reservations);

        const reservation = { ...reservationDoc, broadcast: omit(broadcastWithReservation, "reservations")};
        userReservations.docs.push(reservation)
        i++;
      }
      userReservations.docs = userReservations.docs.sort((a, b) =>
        _order * (new Date(a.created_at)) - (new Date(b.created_at)) )
      userReservations.offset = _start;
      userReservations.total = loggedUser.reservations.length || 0;

      reservations = userReservations;
    }
    //TODO: Gestire prenotazioni da business (dato un broadcastId)


    res.json(reservations);
  } catch (error) {
    next(error);
  }
};
