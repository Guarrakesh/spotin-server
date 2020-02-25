const Container = require('../../../di/Container');
const { ADMIN, BUSINESS, LOGGED_USER } = require('../../middlewares/auth');
const { USER_CONFIRMED_CHECKOUT } = require('../../services/ReservationService');
const PubSub = require('pubsub-js');
/**
 *
 * @param {Server} io
 * @param {Socket} socket
 */
const checkoutSocket = (io) => {

  const container = Container.getInstance();

  /* @type ReservationService */
  const reservationService = container.get('reservationService');

  io.on('connection', (socket) => {
    const user = socket.request.user;
    if (user.role === BUSINESS) {
      socket.on('init_checkout', (data) => {
        console.log('init checkout....');
        console.log(data);
        reservationService.initCheckout(data.reservationId, data.amount);
        if (data.reservationId && data.businessId) {
          PubSub.subscribe(USER_CONFIRMED_CHECKOUT, (reservation) => {
            if (socket.connected) {
              console.log('checkout complete....');
              socket.emit('checkout_complete', reservation);
            }
          })
        }
      });
    }
  });
};


module.exports = checkoutSocket;
