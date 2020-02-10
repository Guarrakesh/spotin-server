const { Notification } = require('../../models/notification.model');
const Logger = require('heroku-logger');
const USER_TARGET_RULES = {
  FAVORITE_SPORTS: 'FAVORITE_SPORTS',
  FAVORITE_COMPETITORS: 'FAVORITE_COMPETITORS',
  FAVORITE_COMPETITIONS: 'FAVORITE_COMPETITIONS',
  LOCATION_NEAR: 'LOCATION_NEAR',
  NUMBER_OF_RESERVATION: 'NUMBER_OF_RESERVATIONS',

};


class NotificationService {
  constructor(userService, firebaseService) {

    this.userService = userService;
    this.firebaseService = firebaseService;

  }


  checkInvalidTokens(results, user) {
    const invalidTokenResults = results.map(res => {
      return !res.success && this.firebaseService.checkTokenNotRegistered(res.error);
    });

    const invalidTokens = [];
    for (let i=0; i<invalidTokenResults.length; i++) {
      if (invalidTokenResults[i]) {
        invalidTokens.push(user.fcmTokens[i].token);
      }
    }

    return invalidTokens;
  }


  /**
   * Store the notification ans its status in the db
   * @param userId
   * @param message
   * @return {Promise<void>}
   */
  async storeNotification(userId, message) {
    const notification = new Notification({
      title: message.notification.title,
      body: message.notification.body,
      imageUrl: message.notification.imageUrl,
     //  type:
    });
    // TODO: Completare
  }


  /**
   * Send a generic notification to an user.
   * @param userId
   * @param message
   * @param stored
   * @return {Promise<null|admin.messaging.BatchResponse|boolean|*>}
   */
  async sendToUser(userId, message, stored = false ) {
    let user;
    try {

      Logger.log('info', `[NotificationService] Sending notification to ${userId}`, message);
      user = await this.userService.findById(userId);
      if (!user || user.fcmTokens.length <= 0) {
        return null;
      }

      const response = await this.firebaseService.sendNotificationToDevices(message, user.fcmTokens.map(t => t.token ), {} );
      Logger.log('debug', '[NotificationService] Response from CloudMessaging ', response);
      return response;
    } catch (error) {
      Logger.log('error', `[NotificationService] Error sending notification to ${userId}: ${error}`, message);

      if (error.requestType) {
        const invalidTokens = this.checkInvalidTokens(error.results, user);
        if (invalidTokens.length > 0)
          this.userService.removeFcmTokens(user, invalidTokens);
      }
      return error;

    }

  }


  async markAsRead(userId, notificatioId) {
    return await Notification.findOneAndUpdate({ _id: notificatioId, userId }, { readAt: Date.now() });

  }
}


exports.NotificationService = NotificationService;
