const PubSub = require('pubsub-js');
const { USER_COUPON_USED } = require('./UserCouponService');
class UserTransaction {

  constructor() {
    this.couponUsedTopic = PubSub.subscribe(USER_COUPON_USED, this.handleCouponUsed)
  }

  handleCouponUsed(msg, data) {
    console.log(msg, data);
  }

};

module.exports  = UserTransaction;