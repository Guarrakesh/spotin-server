const PubSub = require('pubsub-js');
const BaseMongoService = require('./BaseMongoService');
const { Prize } = require('../models/prize.model');
const { PrizeClaim, StatusCodes } = require('../models/prizeclaim.model');
const PRIZE_CLAIMED = 'PRIZE_CLAIMED';
const SpotCoinTransactionService = require('./SpotCoinTransactionService');
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
    const prizeClaim = new PrizeClaim({
      userId: user.id,
      prizeId: prize.id,
      transactionId: transaction.id,
      // Se il premio è immediato, completo subito la richiesta
      status: prize.grantingTime === 0 ? StatusCodes.STATUS_COMPLETED : StatusCodes.STATUS_PENDING,
      requestIP: meta.requestIP,
      requestDevice: meta.requestDevice
    });
    const transaction = await SpotCoinTransactionService.registerPrizeClaimTransaction({ user, prize, prizeClaim });
    prizeClaim.transactionId = transaction.id;
    await prizeClaim.save();
    PubSub.publish(PRIZE_CLAIMED, { prize, prizeClaim, user } );
    return result;
  }
  async findAndPaginate(filter, paginateParams) {

    const results = await Prize.paginate(
        PrizeService.convertRestFilterParams(filter),
        PrizeService.convertRestPagingParams(paginateParams)
    );

    return results;
  }
}


exports.PrizeService = PrizeService;
exports.PRIZE_CLAIMED = PRIZE_CLAIMED;