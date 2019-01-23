const mongoose = require('mongoose');
const offerSchema = require('./offer.schema');

const broadcastBundleSchema = mongoose.Schema({

  business: new mongoose.Schema({
    _id: { type: mongoose.Schema.ObjectId, ref: "Business"},
    name: String,
  }, { _id: false }),

  broadcasts: [
    new mongoose.Schema({
      broadcast: { type: mongoose.Schema.ObjectId, ref: "Broadcast" },
      event: new mongoose.Schema({
        type: mongoose.Types.ObjectId, ref: "SportEvent",
        name: String,
      }, { _id: false }),
      offer: new mongoose.Schema({
        _id: { type: mongoose.Schema.ObjectId, ref: "BusinessOffer"},
        title: String,
      }, { _id: false }),
      is_replaced: Boolean, // Se il locale l'ha rimpiazzato con un'altro broadcast
      is_user_addedd: Boolean, // Se è stata aggiunta manualmente dall'utente
    }, { _id: false, strict: false})],


  start: Date, //Inizio periodo (giorno della prima partita trasmessa)
  end: Date, //Fine periodo (giorno dell'ultima partita trasmessa)
  spots: Number,

  //Se il locale ha acquistato
  bought: Boolean,
  bought_at: Date,


}, { timestamps: true, strict: false });


broadcastBundleSchema.methods = {
  async buildBundle(start, end) {

  },

  async buy() {

  }
};
module.exports = broadcastBundleSchema;
