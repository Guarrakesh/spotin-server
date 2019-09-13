const PubSub = require('pubsub-js');
const { USER_COUPON_USED } = require('./userCouponService');
class UserTransaction {

  constructor() {
    this.couponUsedTopic = PubSub.subscribe(USER_COUPON_USED, this.handleCouponUsed)
  }

  handleCouponUsed(msg, data) {
    console.log(msg, data);
  }

};

module.exports  = UserTransaction;