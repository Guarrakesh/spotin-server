const BaseMongoService = require('./BaseMongoService');
const ExtendableError = require('../utils/ExtendableError');
const { Reservation, ReservationStatus } = require('../models/reservation.model');
const eventEmitter = require('../emitters');

const errorCodes = {
  ALREADY_CHECKEDIN: 'ALREADY_CHECKEDIN',
  CHECKIN_CLOSED: 'CHECKIN_CLOSED',
};

const checkinErrorMessageMap = {
  [errorCodes.ALREADY_CHECKEDIN]: "You already checked-in for this broadcast",
  [errorCodes.CHECKIN_CLOSED]: "Check-ins are closed",

};


class CheckInError extends ExtendableError {
  constructor(type) {
    super({
      message: checkinErrorMessageMap[type],
      isPublic: true,
      internalCode: type,
    });

  }
}

class ReservationService extends BaseMongoService {

  constructor(broadcastService, userService) {
    super(Reservation);
    this.broadcastService = broadcastService;
    this.userService = userService;
  }

  async checkIn(user, broadcast, data = {}) {

    const existing = await this.findOne({ user: user.id, broadcast: broadcast.id });
    console.log(existing);
    if (existing) {
      throw new CheckInError(errorCodes.ALREADY_CHECKEDIN)
    }

    if (Date.now() > broadcast.end_at) {
      throw new CheckInError(errorCodes.CHECKIN_CLOSED);
    }

    const event = (await broadcast.getEvent());
    const business = (await broadcast.getBusiness());

    if (!event || !business) {
      throw new Error(`Unknown ${!event ? 'Event' : 'Business'}`);
    }

    const { peopleNum, cheerFor } = data;
    const reservationAtts = {
      user: user.id,
      broadcast: broadcast.id,
      peopleNum,
      status: ReservationStatus.PENDING,
      business: business.id,
      event: event.id,
    };
    if (cheerFor) {
      // al momento l'utente è solo quello che prenota
      reservationAtts.cheers = {
        userId: user.id,
        cheerFor,
      };
      await this.broadcastService.setCheer(broadcast, cheerFor);
    }
    const reservation = await this.create(reservationAtts);
    await this.userService.addReservation(user, reservation);

    eventEmitter.emit('user-reservation', user, reservation, event.name, business.name);

    return reservation;

  }

  async getCompletedReservations(user) {
    return this.find({ user: user.id, status: ReservationStatus.COMPLETED});
  }


}

exports.ReservationService = ReservationService;
