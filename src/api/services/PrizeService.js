const PubSub = require('pubsub-js');
const BaseMongoService = require('./BaseMongoService');
const { Prize } = require('../models/prize.model');
const { PrizeClaim, StatusCodes } = require('../models/prizeclaim.model');
const User = require('../models/user.model');
const PRIZE_CLAIMED = 'PRIZE_CLAIMED';
class PrizeService extends BaseMongoService {
  constructor() {
    super(Prize);
  }

  /**
   * Assegna un premio ad un utente
   * @param user
   * @param prize
   * @param meta
   * @returns {Promise<PrizeClaim>}
   */
  async claim(user, prize, meta) {

    const prizeClaim = await PrizeClaim.create({
      userId: user.id,
      prizeId: prize.id,
      // Se il premio è immediato, completo subito la richiesta
      status: prize.grantingTime === 0 ? StatusCodes.STATUS_COMPLETED : StatusCodes.STATUS_PENDING,
      requestIP: meta.requestIP,
      requestDevice: meta.requestDevice
    });
    await User.findOneAndUpdate({ _id: user.id }, {
      $inc: { spotCoins: prize.cost }
    });

    PubSub.publish(PRIZE_CLAIMED, { prize, prizeClaim, user } );
    return result;
  }
}


exports.PrizeService = PrizeService;
exports.PRIZE_CLAIMED = PRIZE_CLAIMED;