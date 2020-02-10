const UserTransaction = require('../api/services/SpotCoinTransactionService');
const {UserService} = require('../api/services/UserService');
const {ReservationService} = require('../api/services/ReservationService');
const {BroadcastService} = require('../api/services/BroadcastService');
const { BusinessService } = require('../api/services/BusinessService');
const { EventService } = require('../api/services/events/EventService');
// const { QuestioService } = require('../api/services/QuestioService');
const { FirebaseAdminService } = require('../api/services/FirebaseAdminService');
const { LayoutElementService } = require('../api/services/LayoutElementService');
const { NotificationService } = require('../api/services/notification/NotificationService');

const { CampaignService } = require('../api/services/campaigns/CampaignService');
const { CampaignWorkerService } = require('../api/services/campaigns/CampaignWorkerService');
const firebaseServiceAccout = require('../assets/service-account');

exports.init = function(container) {
  container.register('userTransaction', UserTransaction);
  container.register('businessService', BusinessService);
  container.register('reservationService', ReservationService);
  container.register('broadcastService', BroadcastService);
  //container.register('questioService', QuestioService);
  container.register('userService', UserService, ['reservationService', 'broadcastService', 'businessService'] );
  container.register('layoutElementService', LayoutElementService );
  container.register('eventService', EventService);
  container.register('firebaseAdminService', new FirebaseAdminService(firebaseServiceAccout) );
  container.register('notificationService', NotificationService, ['userService', 'firebaseAdminService']);

  container.register('campaignService', CampaignService);

  container.register('campaignWorkerService', CampaignWorkerService, ['userService', 'notificationService', 'eventService'], {
    immediateInit: true
  });



};

