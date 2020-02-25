const { startSession } = require('mongoose');
const BaseMongoService = require('./BaseMongoService');
const { NewReservation: Reservation, ReservationStatus } = require('../models/reservation.model.new');
const Container = require('../../di/Container');
const PubSub = require('pubsub-js');
const eventEmitter = require('../emitters');

const CONVERSION_FACTOR = 0.01;
const USER_CONFIRMED_CHECKOUT = 'user_confirmed_checkout';
class ReservationService extends BaseMongoService {

  /**
   *
   * @param {SpotCoinTransactionService} transactionService
   */
  constructor(transactionService) {
    super(Reservation);
    this.transactionService = transactionService;
    this.container = Container.getInstance();
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
      broadcastId: broadcast.id,
      checkedInAt: Date.now(),
      status: ReservationStatus.CHECKED_IN,
      userListIds: [user.id], // TODO: handle list ids
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
    eventEmitter.emit('user-reservation', user, reservation, eventName, businessName);


    await reservation.save();
    return Object.assign(reservation.toObject(), {broadcast});
  }

  /**
   * Method that performs the init of the checkout from the business. Sends a notificaiton to the user
   * @param reservationId
   * @return {Promise<void>}
   */
  async initCheckout(reservationId, amount ) {
    const reservation = await this.model.findOneAndUpdate({_id: reservationId}, {status: ReservationStatus.CHECKING_OUT, amount });

    this.notificationService = Container.getInstance().get('notificationService');
    const res = await this.notificationService.sendToUser(reservation.userId, "Il locale ha iniziato il checkout", false, true);

    return res;
  }

  /**
   * Method that call the processCheckout and notify all checkout listeners
   * @param reservation
   * @return {Promise<void>}
   */
  async checkout(reservation) {
    try {
      if ([ReservationStatus.CHECKING_OUT, ReservationStatus.PENDING].includes(reservation.status)) {
        const updated = await this.processCheckout(reservation);
        if (reservation.status === ReservationStatus.PENDING) {
          // TODO: send notification
        } else {
          PubSub.publish(USER_CONFIRMED_CHECKOUT, reservation);
        }
      } else {
        throw new Error("Non è stato effettuato alcun check-out dal ristorante per questo check-in");
      }
    } catch (error) {
      //TODO: what to do here?
    }
  }
  async cancelCheckIn(reservationId) {
    const reservation = await this.model.findById(reservationId);
    if (!reservation) {
      throw new ApiError({message: "Questo check-in non esiste", status: 404});
    }
    return await reservation.remove();

  }





  /**
   * Processo di checkout
   * @param reservation
   * @param amount Cifra spesa (valùta reale)
   */
  async processCheckout(reservation) {

    const session = await startSession();
    const transactionIds = [];
    const spotCoins = ReservationService.convertToSpotCoins(amount);
    try {
      // Distribuisco gli spot coin ai membri della lista
      // Nella lista c'è sempre almeno un ID, cioè quello che ha fatto check-in
      if (reservation.userListIds && reservation.userListIds.length > 0) {
        const partialAmount = Math.floor(spotCoins / reservation.userListIds.length);
        for (const userId of reservation.userListIds) {
          transactionIds.push(await this.transactionService.sendB2C(reservation.businessId, userId, partialAmount));
        }
      } else {
        // Se la lista è vuota, allora mando gli spot coin a chi ha fatto check-in
        transactionIds.push(await this.transactionService.sendB2C(reservation.businessId, reservation.userId, spotCoins));
      }
      // Controllo se l'utente ha speso un ticket
      if (reservation.ticket) {
        // Trasferisco gli spot coin dell'utente al locale
        const spotToTransfer = ReservationService.convertToSpotCoins(amount - (amount * reservation.ticket.value), reservation.spotCoinFactor);
        transactionIds.push(await this.transactionService.sendC2B(reservation.userId, reservation.businessId, spotToTransfer));
      }
      const params = {
        checkedOutAt: Date.now(),
        status: ReservationStatus.COMPLETED,
        transactionsIds: transactionIds,
      };
      if (reservation.ticket) {
        params['ticket.used'] = true;
      }
      const updated = await this.model.findOneAndUpdate({_id: reservation._id}, params).lean();
      await session.commitTransaction();
      return updated;
    } catch (ex) {
      await session.rollbackTransaction();
      throw(ex);
    }
  }


  static convertToSpotCoins(amount, factor) {
    return Math.floor(parseFloat(amount.toFixed()) * factor);
  }
}

exports.ReservationService = ReservationService;
exports.USER_CONFIRMED_CHECKOUT = USER_CONFIRMED_CHECKOUT;
