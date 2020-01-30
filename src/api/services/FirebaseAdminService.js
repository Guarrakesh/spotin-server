const admin = require('firebase-admin');
const { PushNotificationError } = require('./notification/PushNotificationError');

const REQUEST_TYPE = {
  singleDevice: 'SINGLE_DEVICE',
  multicast: 'MULTICAST',
  TOPIC: 'TOPIC',
};


class FirebaseAdminService {
  constructor(serviceAccount) {


    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: 'https://spotin-167c8.firebaseio.com'
    });

    this.messaging = admin.messaging();
  }

  /**
   * @param args
   * @return {Promise<MessagingDevicesResponse>}
   */
  sendNotification(...args) {
    return this.messaging.send(...args);
  }

  /**
   *
   * @param message
   * @param deviceToken
   * @param options
   * @param debug boolean whether to send notification as a test (@see dryRun)
   * @return {Promise<MessagingDevicesResponse|boolean>} the number
   * @throws PushNotificationError
   */
  async sendNotificationToDevice(message, deviceToken, options, debug = false) {
    const res = await this.messaging.sendToDevice(deviceToken, message, { ...options, dryRun: process.env.NODE_ENV === 'development' ? true : debug });
    if (res.failureCount > 0) {
      throw new PushNotificationError(REQUEST_TYPE.singleDevice, res.results, res.successCount, res.failureCount, deviceToken);
    }

    return true;
  }

  /**
   *
   * @param message
   * @param deviceTokens
   * @param options
   *  @param debug boolean whether to send notification as a test (@see dryRun)
   * @return {Promise<admin.messaging.BatchResponse|boolean>}
   * @throws PushNotificationError
   */
  async sendNotificationToDevices(message, deviceTokens, options, debug = false) {
    const { data, notification } = message;
    const res = await this.messaging.sendMulticast({
      data,
      notification,
      tokens: deviceTokens,
      fcmOptions: options,
    }, process.env.NODE_ENV === 'development' ? true : debug);

    if (res.failureCount > 0) {
      return Promise.reject(new PushNotificationError(REQUEST_TYPE.multicast, res.responses, res.successCount, res.failureCount, deviceTokens.length));
    }

    return res;
  }


  /**
   *
   * @param error
   * @return {boolean}
   */
  checkTokenNotRegistered(error) {
    if (error.code === "messaging/registration-token-not-registered") {
      return true;
    }
  }

}


exports.FirebaseAdminService = FirebaseAdminService;
