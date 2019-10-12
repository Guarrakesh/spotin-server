const PubSub = require('pubsub-js');
const BaseMongoService = require('./BaseMongoService');
const { Prize } = require('../models/prize.model');
const { PrizeClaim, StatusCodes } = require('../models/prizeclaim.model');
const PRIZE_CLAIMED = 'PRIZE_CLAIMED';
const SpotCoinTransactionService = require('./SpotCoinTransactionService');
const amazon = require('../utils/amazon');
const { s3WebsiteEndpoint } = require('../../config/vars');
const mime = require('mime-to-extensions');
const makeImageVersions = require('../utils/makeImgeVersions');
const sizeOf = require('image-size');


const prizeImageSize = [
  { width: 1024, height: 1024 },
  { width: 512, height: 512 },
  { width: 256, height: 256 },
];
class PrizeService extends BaseMongoService {
  constructor() {
    super(Prize);
  }

  async uploadImageToS3(prize, file) {
    const ext = mime.extension(file.mimetype);

    const _basePath = `${s3WebsiteEndpoint}/images/prizes`;
    try {
      const data = await amazon.uploadImage(file.buffer, `images/prizes/${prize.id}.${ext}`);
      const { width, height } = await sizeOf(file.buffer);

      const versions = makeImageVersions(_basePath, `${prize.id}.${ext}`, prizeImageSize);
      const image = {
        versions: [{ url: data.Location, width, height }].concat(versions),
        ext,
        mime: file.mimetype,
        fileName: prize.id,
      };
      await Prize.findOneAndUpdate({ _id: prize.id }, { $set: { image } });
    } catch (error) {
      console.error(error);
      throw Error(error);
    }
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
      //transactionId: transaction.id,
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

  async remove(prize) {

    if (prize.image) {
      // Elimino tutte le versioni resized
      prizeImageSize.map(({width, height }) => {
        amazon.deleteObject(`images/prizes/${width}x${height}/${prize.image.fileName}.${prize.image.ext}`)
      });
      amazon.deleteObject(`images/prizes/${prize.image.fileName}.${prize.image.ext}`)
    }
    return await super.remove(prize.id);
  }
}


exports.PrizeService = PrizeService;
exports.PRIZE_CLAIMED = PRIZE_CLAIMED;
