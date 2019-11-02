const UserTransaction = require('../api/services/SpotCoinTransactionService');
const {UserService} = require('../api/services/UserService');
const {ReservationService} = require('../api/services/ReservationService');
const {BroadcastService} = require('../api/services/BroadcastService');

exports.init = function(container) {
  container.register('userTransaction', UserTransaction);
  container.register('broadcastService', BroadcastService);
  container.register('reservationService', ReservationService, ['broadcastService', 'userService']);
  container.register('userService', UserService );
};

