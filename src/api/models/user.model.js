const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const uuidv4 = require('uuid/v4');
const APIError = require('../utils/APIError');
const { env, jwtSecret, jwtExpirationInterval } = require('../../config/vars');
const mongoosePaginate = require('mongoose-paginate');
const mime = require('mime-to-extensions');
const sizeOf = require('image-size');

const { sportSchema } = require('./sport.model');
const { reservationSchema } = require('./reservation.model');
const { broadcastSchema } = require('./broadcast.model');
const { imageSchema } = require('./image');
const { s3WebsiteEndpoint } = require('../../config/vars');
const amazon = require("../utils/amazon");

const { ADMIN, BUSINESS, LOGGED_USER } = require('../middlewares/auth');

const { Business } = require('./business.model');

const imageSizes = [
  { width: 800, height: 800 },
  { width: 400, height: 400 },
  { width: 150, height: 150 },
];

/**
 * User Roles
 */
const roles = [LOGGED_USER, ADMIN, BUSINESS];

/**
 * User Schema
 * @private
 */
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 128,
  },
  name: {
    type: String,
    maxlength: 128,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    maxlength: 45
  },
  username: {
    type: String,
    maxlength: 128,
    index: true,
    trim: true,
  },
  //TODO: Dopo che ho definito il model Business
  // favorite_businesses:

  services: {
    facebook: String,
    google: String,
  },
  role: {
    type: String,
    enum: roles,
    default: 'user',
  },
  picture: {
    type: String,
    trim: true,
  },
  favorite_sports: [
    new mongoose.Schema({
      _id: { type: mongoose.Schema.ObjectId, ref: "Sport" },
      name: String,
    }, { timestamps: true } )],

  favorite_competitors: [
    new mongoose.Schema({
      _id: { type: mongoose.Schema.ObjectId, ref: "Competitor" },
      name: String,
      sport: { type: mongoose.Schema.ObjectId, ref: "Sport" },
    }, { timestamps: true  })],

  favorite_events: {
    type: [{type: mongoose.Schema.ObjectId, ref: "SportEvent"}],


  },
  reservations: [
    {type: mongoose.Schema.ObjectId, ref: "Broadcast"}
  ],

  passwordResetToken: String,

  fcmTokens: {
    type: [ mongoose.Schema({ token: String, deviceId: String }, { _id: false }) ]
  },
  notificationsEnabled: Boolean,

  sportHits: [ mongoose.Schema({
    sport: { type: mongoose.Schema.ObjectId, ref: "SportEvent" },
    name: String,
    hits: Number
  }, { _id: false })],
  competitionHits: [ mongoose.Schema({
    competition: { type: mongoose.Schema.ObjectId, ref: "Competition" },
    name: String,
    hits: Number
  }, { _id: false })],
  competitorHits: [ mongoose.Schema({
    competitor: { type: mongoose.Schema.ObjectId, ref: "Competitor" },
    name: String,
    hits: Number
  }, { _id: false })],
  photo: imageSchema,


}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
userSchema.pre('save', async function save(next) {
  try {
    if (!this.isModified('password')) return next();
    const rounds = env === 'test' ? 1 : 10;

    //Hash password
    const hash = await bcrypt.hash(this.password, rounds);
    this.password = hash;

    return next();
  } catch (error) {
    return next(error);
  }
});

/**
 * Methods
 */
userSchema.method({
  transform() {
    const transformed = {};
    const fields = [
      'name',
      'email',
      'id',
      '_id',
      'picture',
        'favorite_competitors',
        'photo',
      'role',
      'created_at', "updated_at", "reservations", "favorite_events", "favorite_sports","services", "notificationsEnabled"];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
  async resetToken() {
    const token = await crypto.randomBytes(20);
    return token.toString('hex'); //genera stringa di 40 caratteri (20 esadecimali)
  },
  token() {
    const playload = {
      exp: moment().add(jwtExpirationInterval, 'minutes').unix(),
      iat: moment().unix(),
      sub: this._id,
      role: this.role
    };
    return jwt.encode(playload, jwtSecret);
  },

  async passwordMatches(password) {
    return bcrypt.compare(password, this.password);
  },
  getIsBusiness() {
    return this.role === "business";

  },
  async businesses() {
    const businesses = await Business.find({user: this._id});

    return businesses || [];
  },
  s3Path() {
    return `images/users/${this.id}`;
  },

  async uploadPhoto(file, meta) {
    const ext = mime.extension(file.mimetype);
    try {

      //Cancello prima tutta la cartella
      const data = await amazon.uploadImage(file.buffer, `${this.s3Path()}/photo.${ext}`);
      const {width, height} = await sizeOf(file.buffer);
      //Image_versions non viene pushato perché quando cambia l'immagine, quella precedente deve venire cancellata
      const photo = {
        versions: [
          { url: data.Location, width, height }
          ],
        ext,
        ...meta,
      };


      const basePath = `${s3WebsiteEndpoint}/${this.s3Path()}`;
      const fileName = "photo." + ext;
      photo.versions = photo.versions.concat(this.constructor.makeImageVersions(basePath, fileName));
      this.photo = photo;
      await this.save();
      //await this.update({_id: savedComp._id}, { $set: {image_versions: [{url: data.Location, width, height}] }}).exec();
    } catch (error) {
      throw Error(error);
    }
  }
});

/**
 * Statics
 */
userSchema.statics = {

  roles,

  /**
   * Get user
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  async get(id) {
    try {
      let user;

      if (mongoose.Types.ObjectId.isValid(id)) {
        user = await this.findById(id).exec();
      }
      if (user) {
        return user;
      }

      throw new APIError({
        message: 'User does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * Find user by email and tries to generate a JWT token
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  async findAndGenerateToken(options, clientType) {
    const { email, password, refreshObject } = options;
    if (!email) throw new APIError({ message: 'An email is required to generate a token' });
    const user = await this.findOne({ email });


    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    };

    if (password) {
      if (user && await user.passwordMatches(password)) {

        if ((clientType === "business" && user.role !== "business") || clientType === "mobileapp" && user.role !== LOGGED_USER) {
          //Se il login viene dall'App Business, controllo che l'utente trovato sia un business, altrimenti do autenticazione fallita
          err.message = 'Incorrect email or password';
          throw new APIError(err);
        }
        return { user, accessToken: user.token() };
      }

      err.message = 'Incorrect email or password';
    } else if (refreshObject && refreshObject.userEmail === email) {

      if (moment(refreshObject.expires).isBefore()) {
        err.message = 'Invalid refresh token.';
      } else {
        return { user, accessToken: user.token() };
      }
    } else {
      err.message = 'Incorrect email or refreshToken';
    }
    throw new APIError(err);
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({
         _end = 10, _order = "DESC",
         _sort="createdAt", _start = 0,
         name, email, role, q, id_like
       }) {
    let options = omitBy({ name, email, role }, isNil);

    if (q) {
      options = {
        ...options,
        $or: [
          { name: { "$regex": q, "$options": "i" } },
          { email: { "$regex": q, "$options": "i " } }
        ]
      }
    }
    if (id_like) {
      options._id = { $in: id_like.split('|')}
    }
    return this.paginate(options, {
      sort: {[_sort]: _order.toLowerCase()},
      offset: parseInt(_start),
      limit: parseInt(_end - _start)

    });

  },

  /**
   * Return new validation error
   * if error is a mongoose duplicate key error
   *
   * @param {Error} error
   * @returns {Error|APIError}
   */
  checkDuplicateEmail(error) {
    if (error.name === 'MongoError' && error.code === 11000) {
      return new APIError({
        message: 'Validation Error',
        errors: [{
          field: 'email',
          location: 'body',
          messages: ['"email" already exists'],
        }],
        status: httpStatus.CONFLICT,
        isPublic: true,
        stack: error.stack,
      });
    }
    return error;
  },

  async oAuthLogin({
                     service, id, email, name, picture
                   }) {
    const user = await this.findOne({ $or: [{ [`services.${service}`]: id }, { email }] });
    if (user) {
      user.services[service] = id;
      if (!user.name) user.name = name;
      if (!user.picture) user.picture = picture;
      return user.save();
    }
    const password = uuidv4();
    return this.create({
      services: { [service]: id }, email, password, name, picture
    });
  },

  makeImageVersions(basePath, fileName) {

    const _basePath = basePath.replace(/^\/|\/$/g, ''); // Rimuovi i trailing e leading slash
    const _fileName = fileName.replace(/^\/|\/$/g, '');

    const versions = [];
    imageSizes.forEach(({ width, height }) => {
      versions.push({
        url: `${_basePath}/${width}x${height}/${_fileName}`,
        width,
        height
      });
    });
    return versions;
  }
};
userSchema.plugin(mongoosePaginate);
/**
 * @typedef User
 */
module.exports = mongoose.model('User', userSchema);
