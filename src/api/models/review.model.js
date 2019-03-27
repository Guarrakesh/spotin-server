const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const broadcastReviewSchema = new mongoose.Schema({

  rating: {
    type: new mongoose.Schema({
      av: Number,
      food: Number,
      price: Number,
      people: Number,
      sub: Number,
    }, { _id: false }),
    required: true,
  },

  comment: String,
  status: {
    type: Number,
    enum: [0,1,-1], // 0 - In attesa di revisione, 1 - Pubblicata, -1 - Rifiutata
    default: 0,
  }




}, { timestamps: true });



broadcastReviewSchema.index({ businessId: 1 });

broadcastReviewSchema.plugin(mongoosePaginate);
exports.broadcastReviewSchema = broadcastReviewSchema;
