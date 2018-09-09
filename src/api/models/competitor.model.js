const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const uuidv4 = require('uuid/v4');
const APIError = require('../utils/APIError');
const { env, jwtSecret, jwtExpirationInterval } = require('../../config/vars');
const Sport = require('./sport.model.js');
const mongoosePaginate = require('mongoose-paginate');
const { slugify }  = require('lodash-addons');
const { imageVersionSchema } = require('./imageVersion');


/* Endpoint per ottenere, on the fly, le immagini ridimensionate */
const { s3WebsiteEndpoint } = require('../../config/vars');

const { uploadImage } = require('../utils/amazon.js');
const sizeOf = require('image-size');
const mime = require('mime-to-extensions');


/* Versioni dell'immagine (oltre quella originale) che andranno inserite nel documento
 * (Amazon s3/Lambda si occuperà del resize)
 */
const imageSizes = [
  {width: 32, height: 32},
  {width: 64, height: 64},
  {width: 128, height: 128},
  {width: 256, height: 256},
];
const competitorSchema = new mongoose.Schema({
  sport: {
    type: mongoose.Schema.ObjectId,
    ref: "Sport"
  },
  name: {
    type: String,
    trim: true,
    maxlength: 128
  },
  image_versions: {
    type: [imageVersionSchema],
    default: []
  },
  slug: {
    type: String,
    trim: true,
    maxlenth: 128,
    lowercase: true,
  },


  first_name: {
    type: String,
    maxlength: 128,
    trim: true
  },
  last_name: {
    type: String,
    maxlength: 128,
    trim: true
  },
  full_name: {
    type: String,
    maxlength: 256,
    trim: true
  },
  isPerson: {
    type: Boolean,
    default: false
  }
});


competitorSchema.method({
  async uploadPicture(file) {

    const ext = mime.extension(file.mimetype);

    try {
      const data = await uploadImage(file.buffer, `images/competitor-logos/${this.slug}.${ext}`);
      const {width, height} = await sizeOf(file.buffer);
      //Image_versions non viene pushato perché quando cambia l'immagine, quella precedente deve venire cancellata
      this.image_versions = [{url: data.Location, width, height}];


      const basePath = s3WebsiteEndpoint + "/images/competitor-logos";

      imageSizes.forEach(({width, height}) => {

        this.image_versions.push({
          url: `${basePath}/${width}x${height}/${this.slug}.${ext}`,
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
competitorSchema.pre('save', function(next) {


  if ((this.isNew && !this.slug) || (this.isPerson && !this.isNew && this.isModified('full_name'))
    || (!this.isPerson && !this.isNew && this.isModified('name'))) {

    this.slug = slugify(this.isPerson ? this.full_name : this.name);

  }
  next();
});

competitorSchema.plugin(mongoosePaginate);
exports.competitorSchema = competitorSchema
exports.Competitor = mongoose.model('Competitor',competitorSchema);
