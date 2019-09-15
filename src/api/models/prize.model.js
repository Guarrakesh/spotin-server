const mongoose = require('mongoose');
const {imageSchema} = require('./image');
const { slugify } = require('lodash-addons');
const prizeSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    unique: true,
  },
  description: String,
  cost: {
    required: true,
    type: Number,
  },
  image: imageSchema,
  slug: {
    type: String,
    required: true,
    unique: true,
    default: function() {
      return slugify(this.name);
    }
  },
  cover: imageSchema,
  // Se presente, Indica che è un premio consumabile in un locale
  restaurantRelatedRules: new mongoose.Schema({
    // Indica l'importo minimo da spendere per ricevere il premio (in EUR)
    minimumSpending: Number,
    // Indica il massimo valore del premio (in EUR)
    maximumValue: Number,

  }, { _id: false, timestamps: false  }),

  // Disponibilità
  availability: Number,
  // Fine della disponibilità del premio
  expiresAt: Date,

  // Tempo necessario per l'assegnazione del premio (in ORE, 0: immediato)
  grantingTime: {
    required: true,
    type: Number,
  },


}, { timestamps: true });



exports.prizeSchema = prizeSchema;
exports.Prize = mongoose.model('Prize', prizeSchema, 'prizes');
