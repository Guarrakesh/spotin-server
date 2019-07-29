const mongoose = require('mongoose');
const moment = require('moment');
const mongoosePaginate = require('mongoose-paginate');
const offerSchema = require('./offer.schema');
const { Broadcast } = require('./broadcast.model');
const { Business } = require('./business.model');
const { SportEvent } = require('./sportevent.model');

const broadcastBundleSchema = mongoose.Schema({

  business: new mongoose.Schema({
    _id: { type: mongoose.Schema.ObjectId, ref: "Business"},
    name: String,
  }, { _id: false }),

  broadcasts: [
    new mongoose.Schema({
      _id: { type: mongoose.Schema.ObjectId, ref: "Broadcast"},
      event: new mongoose.Schema({
        name: String,
        start_at: Date,
      }, { strict: false }),
      offer: offerSchema,
      is_replaced: Boolean, // Se il locale l'ha rimpiazzato con un'altro evento
      is_user_addedd: Boolean, // Se è stato aggiunta manualmente dall'utente
      spots: Number,
    }, { strict: false})],

  totalSpots: Number,
  start: Date, //Inizio periodo (giorno della prima partita trasmessa)
  end: Date, //Fine periodo (giorno dell'ultima partita trasmessa)
  spots: Number,

  //Se il locale ha acquistato
  published: Boolean,
  published_at: Date,


}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, strict: false });


broadcastBundleSchema.methods = {
  async calculateSpots() {

  },
  async publish() {
    try {
      let totalSpots = 0;
      if (!this.published_at) {
        this.published = true;
        this.published_at = moment().toISOString();
        const business = await Business.findById(this.business.id);
        for (const broadcast of this.broadcasts) {
          const event = await SportEvent.findById(broadcast.event.id);
          if (!business.canBroadcastEvent(event)) {
            continue;
          }

          const newBroadcast = new Broadcast({
            event: broadcast.event.eventId,
            business: this.business._id,
            offer: broadcast.offer,
            bundle: this._id,
          });
          totalSpots += business.paySpots(broadcast.spots);
          await newBroadcast.save();
          broadcast._id = newBroadcast._id;

        }
        await this.save();
      }
    } catch (e) {
      throw e;
    }
  },
};

broadcastBundleSchema.statics = {
  async buildBundle(business, events = []) {

    if (events.length <= 0) {
      return Promise.reject("Non ci sono eventi da trasmettere.");
    }

    const broadcastBundle = new this({
      business: { _id: business._id, name: business.name },
    });

    const etbs = this.distributeEvents(events);

    broadcastBundle.broadcasts = etbs.map(etb => ({
          event: {
            eventId: mongoose.Types.ObjectId(etb.id),
            name: etb.name,
            start_at: etb.start_at,
            competition: mongoose.Types.ObjectId(etb.competition.id),
            sport: mongoose.Types.ObjectId(etb.sport.id),
            competitors: etb.competitors,
          },
          offer: this.getOfferFor(etb),
          spots: etb.spots || 0,
        })
    ).sort((a,b) => a.event.start_at - b.event.start_at);
    const start = moment(broadcastBundle.broadcasts[0].event.start_at)
        .startOf('day').toDate(); // Di default l'inizio del giorno del primo evento
    const end = moment( broadcastBundle.broadcasts[ broadcastBundle.broadcasts.length-1].event.start_at)
        .endOf('day').toDate(); // Default fine del giorno dell'ultimo evento
    broadcastBundle.start = start;
    broadcastBundle.end = end;
    broadcastBundle.totalSpots = broadcastBundle.broadcasts
      .reduce((acc, b) => acc + b.spots, 0);
      
    broadcastBundle.calculateSpots();
    return broadcastBundle;
  },

  getOfferFor(event) {
    return undefined;
  },
  calculateSpots(broadcastBundle) {

  },
  distributeEvents(events) {
    const _eventToBroadcast = [events.shift()];
    let overlaps = false;
    for (const bEvent of events) {
      for (etb of _eventToBroadcast) {
        overlaps = bEvent.getOverlaps(etb);
        //Appena trovo un evento che overlappa, esco dal for e lo ignoro
        if (overlaps) break;
      }
      if (!overlaps) _eventToBroadcast.push(bEvent);

    }

    return _eventToBroadcast;
  },

};

broadcastBundleSchema.plugin(mongoosePaginate);
exports.broadcastBundleSchema = broadcastBundleSchema;
exports.BroadcastBundle = mongoose.model('BroadcastBundle', broadcastBundleSchema, 'broadcast_bundles');
