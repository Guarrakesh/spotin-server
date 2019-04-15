const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy } = require('lodash');
const moment = require('moment-timezone');
const APIError = require('../utils/APIError');
const { imageVersionSchema } = require('./image');
const { slugify } = require('lodash-addons');
const { pagination } = require('../utils/aggregations');
const { Sport } = require('./sport.model');

const imageSizes = [
  { width: 32, height: 32 },
  { width: 64, height: 64 },
  { width: 128, height: 128 },
  { width: 256, height: 256 },
];
const { s3WebsiteEndpoint } = require('../../config/vars');
const { uploadImage } = require('../utils/amazon.js');
const sizeOf = require('image-size');
const mime = require('mime-to-extensions');

const competitionSchema = new mongoose.Schema({
  sport: {

    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sport',

  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  competitorsHaveLogo: {
    type: Boolean,
    default: true,
  },
  country: {
    type: String,
    trim: true,
  },
  image_versions: [imageVersionSchema],
  appealValue: Number,
});


competitionSchema.statics = {
  async get(id) {
    try {
      let competition;
      if (mongoose.Types.ObjectId.isValid(id)) {
        competition = await this.findById(id).exec()
      }
      if (competition) {
        return competition;
      }
      throw new APIError({
        message: 'Competition does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },
  async list(options) {
    const filter = omitBy(options, ['_start', '_end' , 'id_like', '_sort', '_order']);

    if (options._id) filter._id = mongoose.Types.ObjectId(options._id);
    if (options.sport) filter.sport = mongoose.Types.ObjectId(options.sport);
    if (options.id_like) filter.id = { $in: options.id_like.split('|') };


    const weekStartDate = moment().startOf('day').toDate();
    const weekEndDate = moment().add(7, 'day').endOf('day').toDate();

    try {
      const result = await this.aggregate([
        { $match: filter },
        {
          $lookup: {
            from: 'sport_events',
            let: { competition_id: '$_id', start_date: weekStartDate, end_date: weekEndDate},
            as: 'week_events',
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$competition', '$$competition_id'] },
                      { $gte: ['$start_at', '$$start_date'] },
                      { $lt: ['$start_at', '$$end_date'] },
                    ],
                  },
                },
              },
              { $count: 'count' },
            ],

          },
        },
        // Non sovrascrivo week_events per la Retro compatibilità
        // TODO: Sostituire "week_events" con "weekEvents" quando non servirà più retrocombatibilità
        { $addFields: { weekEvents: { $sum: '$week_events.count' } } },
        ...pagination({ sort: { field: 'weekEvents', order: -1 }, options }),

      ]);
      return result.length === 1 ? result[0] : { docs: [], total: 0 };
    } catch (error) {
      throw error;
    }
  }
};


competitionSchema.method({
  async uploadPicture(file) {

    const ext = mime.extension(file.mimetype);
    const slug = slugify(this.name);
    try {
      const data = await uploadImage(file.buffer, `images/competition-logos/${slug}.${ext}`);
      const { width, height } = await sizeOf(file.buffer);
      // Image_versions non viene pushato perché quando cambia l'immagine, quella precedente deve venire cancellata
      this.image_versions = [{ url: data.Location, width, height }];


      const basePath = s3WebsiteEndpoint + '/images/competition-logos';

      imageSizes.forEach(({ width, height }) => {

        this.image_versions.push({
          url: `${basePath}/${width}x${height}/${slug}.${ext}`,
          width,
          height,
        });

      });
      await this.save();
      // await this.update({_id: savedComp._id}, { $set: {image_versions: [{url: data.Location, width, height}] }}).exec();
    } catch (error) {
      console.log(error);
      throw Error(error);
    }

  },

  async getSport() {
    return await Sport.findById(this.sport).exec();
  }

});
exports.Competition = mongoose.model('Competition', competitionSchema);
exports.competitionSchema = competitionSchema;
