const Container = require('../../../di/Container');
const { ADMIN, BUSINESS, LOGGED_USER } = require('../../middlewares/auth');
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
        if (data.reservationId && data.businessId) {
          socket.join('CHECKOUT_ROOM_' + data.reservationId, async () => {
            if (data.businessId && data.reservationId) {
              socket.on('postpone_checkout', (data) => {
              });
              await reservationService.initCheckout(data.reservationId);
            }
          });

        }
      });
    } else if (user.role === LOGGED_USER) {
      socket.emit('message', 'pippopluto');
      socket.on('join_checkout', async (data) => {
        if (data.reservationid) {
          socket.join('CHECKOUT_ROOM_' + data.reservationid, () => {
            io.to('CHECKOUT_ROOM_' + data.reservationid).emit({ message: 'user_joined_checkout', userId: socket.request.user.id });

          });
        }
      });

      socket.on('confirm_checkout', async (data) => {
        if (data.reservationId && socket.request.user.role === LOGGED_USER) {
          await reservationService.completeCheckout(data.reservationId);
        }
      })

    }


  });
};


module.exports = checkoutSocket;
