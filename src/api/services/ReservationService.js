const BaseMongoService = require('./BaseMongoService');
const { NewReservation: Reservation, ReservationStatus } = require('../models/reservation.model.new');
const Container = require('../../di/Container');

const eventEmitter = require('../emitters');

class ReservationService extends BaseMongoService{

  constructor() {
    super(Reservation);

    this.container = Container.getInstance();
  }


  async listCheckIns()
  {

  }
  /**
   * Check in a broadcast for a user
   * @param user
   * @param broadcastId
   * @param params
   */
  async checkIn(user, broadcastId, params = {}) {
    this.notificationService = this.container.get('notificationService');
    this.userService = this.container.get('userService');
    this.broadcastService = this.container.get('broadcastService');

    const {cheerFor, peopleNum} = params;

    const broadcast = await this.broadcastService.findById(broadcastId);
    if (!broadcast) {
      throw new ApiError({message: "Questa trasmissione non esiste", status: 404});
    }
    if (broadcast.reservations.find(r => r.user.toString() === user._id.toString())) {
      return next(new ApiError({message: "Hai già prenotato questa offerta.", status: 400}));
    }


    const event = await broadcast.getEvent();
    const business = await broadcast.getBusiness();


    const reservation = new Reservation({
      businessId: business.id,
      userId: user.id,
      eventId: event.id,
      broadcastId: broadcast,
      checkedInAt: Date.now(),
      status: ReservationStatus.CHECKED_IN,
      peopleNum,
    });

    if (cheerFor) {
      // al momento l'utente è solo quello che prenota
      reservation.cheers = {
        userId: user.id,
        cheerFor,
      };

      this.broadcastService.setCheerFor(broadcast, cheerFor);
    }

    const eventName = event.name;
    const businessName = business.name;
    eventEmitter.emit('user-reservation', user, reservation, eventName, businessName );

    await reservation.save();
    return reservation;
  }

  async initCheckout(reservationId) {
    const reservation = await this.model.findOneAndUpdate(reservationId, { status: ReservationStatus.CHECKING_OUT });

    this.notificationService = Container.getInstance().get('notificationService');
    const res = await this.notificationService.sendToUser(reservation.userId, "Il locale ha iniziato il checkout", false, true);
  }

  async completeCheckout(reservationId) {
    const reservation = await this.model.findOneAndUpdate(reservationId, { status: ReservationStatus.COMPLETED });

    // TODO: other stuff
  }
}

exports.ReservationService = ReservationService;
