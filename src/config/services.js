const UserTransaction = require('../api/services/SpotCoinTransactionService');
const {UserService} = require('../api/services/UserService');
const {ReservationService} = require('../api/services/ReservationService');
const {BroadcastService} = require('../api/services/BroadcastService');
const { BusinessService } = require('../api/services/BusinessService');
exports.init = function(container) {
  container.register('userTransaction', UserTransaction);
  container.register('businessService', BusinessService);
  container.register('reservationService', ReservationService);
  container.register('broadcastService', BroadcastService);

  container.register('userService', UserService, ['reservationService', 'broadcastService', 'businessService'] );
};

