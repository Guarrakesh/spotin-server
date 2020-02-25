const PubSub = require('pubsub-js');
const { USER_COUPON_USED } = require('./UserCouponService');
const { PRIZE_CLAIMED } = require('./PrizeService');
const { StatusCodes: PrizeClaimStatusCodes } = require('../models/prizeclaim.model');
const User = require('../models/user.model');
const { SpotCoinTransaction, StatusCodes, TypeCodes  } = require('../models/spotcointransaction.model');
class SpotCoinTransactionService {

  /**
   *
   * @param {BusinessService} businessService
   * @param {UserService} userService
   */
  constructor(businessService, userService) {
    this.couponUsedTopic = PubSub.subscribe(USER_COUPON_USED, this.handleCouponUsed)
    //  this.prizeRequestedTopic = PubSub.subscribe(PRIZE_CLAIMED, this.handlePrizeRequested);
    this.businessService = businessService;
    this.userService = userService;
  }

  static async registerPrizeClaimTransaction(data) {
    const { prize, prizeClaim, user } = data;
    await User.findOneAndUpdate({ _id: user.id }, {
      $inc: { spotCoins: prize.cost }
    });

    const created = await SpotCoinTransaction.create({
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
    return created;
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

  async sendB2C(from, to, amount){
    await this.businessService.takeSpotCoins(from, amount);
    await this.userService.addSpotCoins(to, amount);
    const transaction = await SpotCoinTransaction.create({
      senderId: from,
      receiverId: to,
      type: TypeCodes.BusinessToUser,
      amount,
      status: StatusCodes.STATUS_COMPLETED
    });
    return transaction.id;
  }

  async sendC2B(from, to, amount){
    await this.businessService.addSpotCoins(to, amount);
    await this.userService.takeSpotCoins(from, amount);
    const transaction = await SpotCoinTransaction.create({
      senderId: from,
      receiverId: to,
      type: TypeCodes.UserToBusiness,
      amount,
      status: StatusCodes.STATUS_COMPLETED,
    });
    return transaction._id;
  }
};

module.exports = SpotCoinTransactionService;
