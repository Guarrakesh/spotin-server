const PubSub = require('pubsub-js');
const { USER_COUPON_USED } = require('./UserCouponService');
const { PRIZE_CLAIMED } = require('./PrizeService');
const { StatusCodes: PrizeClaimStatusCodes } = require('../models/prizeclaim.model');
const User = require('../models/user.model');
const { SpotCoinTransaction, StatusCodes, TypeCodes  } = require('../models/spotcointransaction.model');
class SpotCoinTransactionService {

  constructor() {
    this.couponUsedTopic = PubSub.subscribe(USER_COUPON_USED, this.handleCouponUsed)
    this.prizeRequestedTopic = PubSub.subscribe(PRIZE_CLAIMED, this.handlePrizeRequested);

  }

  handlePrizeRequested(msg, data) {
    const { prize, prizeClaim, user } = data;
    SpotCoinTransaction.create({
      senderId: user.id,
      amount: prize.cost,
      // Se il premio è immediato, completo subito la transazione
      status: prizeClaim.status === PrizeClaimStatusCodes.STATUS_COMPLETED
        ? StatusCodes.STATUS_COMPLETED
        : StatusCodes.STATUS_PENDING,
      type: TypeCodes.UserToSpotIn,
      meta: {
        requestIP: prizeClaim.requestIp,
        requestDevice: prizeClaim.requestDevice
      }
    });

  }


  async handleCouponUsed(msg, data) {
    const { user, coupon } = data;

    await SpotCoinTransaction.create({
      receiverId: user.id,
      amount: coupon.value,
      status: StatusCodes.STATUS_COMPLETED,
      type: TypeCodes.SpotInToUser,
    })
  }

};

module.exports  = SpotCoinTransactionService;