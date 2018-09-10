const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const uuidv4 = require('uuid/v4');
const APIError = require('../utils/APIError');
const { env, jwtSecret, jwtExpirationInterval } = require('../../config/vars');
const { imageVersionSchema } = require('./imageVersion');
const { slugify } = require('lodash-addons');
const {Sport} = require('./sport.model.js');


const imageSizes = [
  {width: 32, height: 32},
  {width: 64, height: 64},
  {width: 128, height: 128},
  {width: 256, height: 256},
];
const { s3WebsiteEndpoint } = require('../../config/vars');
const { uploadImage } = require('../utils/amazon.js');
const sizeOf = require('image-size');
const mime = require('mime-to-extensions');



const competitionSchema = new mongoose.Schema({
  sport: {

      type: mongoose.Schema.Types.ObjectId,
      ref: "Sport"

  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  competitorsHaveLogo: {
    type: Boolean,
    default: true
  },
  country: {
    type: String,
    trim: true,
  },
  image_versions: [imageVersionSchema]
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
        message: "Competition does not exist",
        status: httpStatus.NOT_FOUND
      });
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
      const {width, height} = await sizeOf(file.buffer);
      //Image_versions non viene pushato perché quando cambia l'immagine, quella precedente deve venire cancellata
      this.image_versions = [{url: data.Location, width, height}];


      const basePath = s3WebsiteEndpoint + "/images/competition-logos";

      imageSizes.forEach(({width, height}) => {

        this.image_versions.push({
          url: `${basePath}/${width}x${height}/${slug}.${ext}`,
          width: width,
          height: height
        });

      });
      await this.save();
      //await this.update({_id: savedComp._id}, { $set: {image_versions: [{url: data.Location, width, height}] }}).exec();
    } catch (error) {
      console.log(error);
      throw Error(error);
    }

  }

});
exports.Competition = mongoose.model('Competition', competitionSchema);
exports.competitionSchema = competitionSchema;
