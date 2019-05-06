const mongoose = require('mongoose');

const mongoosePaginate = require('mongoose-paginate');
const { slugify }  = require('lodash-addons');
const { imageVersionSchema } = require('./image');
const Vibrant = require('node-vibrant');

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

  country: String,
  first_name: {
    type: String,
    maxlength: 128,
    trim: true,
  },
  last_name: {
    type: String,
    maxlength: 128,
    trim: true,
  },
  full_name: {
    type: String,
    maxlength: 256,
    trim: true,
  },
  isPerson: {
    type: Boolean,
    default: false,
  },
  is_club: {
    type: Boolean,
    default: true,
  },
  color: String,
  appealValue: Number,
}, { createdAt: 'created_at', updatedAt: 'updated_at' });


competitorSchema.method({
  transform() {
    const transformed = {};
    const fields = ['_id',
      'id',
      'sport',
      'name',
      'image_versions',
      'slug',
      'country',
      'first_name',
      'last_name',
      'full_name',
      'is_person',
      'is_club',
      'appealValue',
      'created_at',
      'updated_at',
    ];
    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
  async uploadPicture(file) {

    const ext = mime.extension(file.mimetype);
    const slug = `${slugify(this.name)}_${this.id}`;
    try {
      const data = await uploadImage(file.buffer, `images/competitor-logos/${slug}.${ext}`);
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
competitorSchema.methods.getColorLazy = async function() {

  if (!this.color) {
    if (this.image_versions && this.image_versions[0]) {
      const palette = await Vibrant.from(this.image_versions[0].url).getPalette();
      this.color = palette.Vibrant.getHex();
      this.save();
      return palette.Vibrant.getHex();
    }
    return null;
  }
  return this.color;

};
competitorSchema.plugin(mongoosePaginate);
exports.competitorSchema = competitorSchema
exports.Competitor = mongoose.model('Competitor',competitorSchema);
