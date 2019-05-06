const { Broadcast } = require('../api/models/broadcast.model');
const { Business } = require('../api/models/business.model');
const { SportEvent } = require('../api/models/sportevent.model');

const mongoose = require('mongoose');
exports.Broadcast = `
  input LocationInput {
    lat: Float!
    lng: Float!
  }
  extend type Query {
    getBroadcastsByEventAndLocation(eventId: ID!, location: LocationInput): [Broadcast]
  }
  
  type Offer {
    type: Int
    value: Float!
    title: String
    description: String
  }
  type Broadcast {
    id: ID!
    event: SportEvent
    business: Business
    offer: Offer
    
  }
  
  
`;

exports.broadcastResolvers = {
  Query: {
    async getBroadcastsByEventAndLocation(obj, args) {
      const broadcasts = await Broadcast.aggregate([
        { $match: { event: mongoose.Types.ObjectId(args.eventId) } },
        {
          $lookup: {
            from: 'businesses',
            let: {
              businessId: '$business',
            },
            as: 'businessObj',
            pipeline: [
              {
                $geoNear: {
                  near: {
                    type: 'Point',
                    coordinates: [
                      args.location.lng, args.location.lat,
                    ],
                  },
                  distanceField: 'dist.calculated',
                  distanceMultiplier: 1 / 1000,
                  spherical: true,
                  maxDistance: 9999,
                  includeLocs: 'dist.location',
                },
              }, {
                $match: {
                  $expr: {
                    $eq: [
                      '$_id', '$$businessId',
                    ],
                  },
                },
              }, {
                $project: {
                  _id: 1,
                  dist: 1,
                  name: 1,
                },
              },
            ],
          },
        },


      ]).exec();
      return broadcasts || [];
    }

  },

  Broadcast: {
    business: async parent => Business.findById(parent.business),
    event: parent => SportEvent.findById(parent.event)
  }
};