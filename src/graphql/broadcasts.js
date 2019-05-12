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
    distanceFromUser: Float!
    
  }
  type BroadcastFeed {
    pageInfo: PageInfo
    edges: [Broadcast!]!
  } 
  
`;

exports.broadcastResolvers = {
  Query: {
    async getBroadcastsByEventAndLocation(obj, args) {
      return await getBroadcastByEventAndLocation(args.eventId, args.location)
    }

  },

  Broadcast: {
    business: async parent => Business.findById(parent.business),
    event: parent => SportEvent.findById(parent.event),
    id: parent => parent._id,
    //distanceFromUser: parent => parent.businessObj && parent.businessObj.dist ? parent.businessObj.dist.calculated : 0,
  }
};

async function getBroadcastByEventAndLocation(eventId, location, pagination = {}) {

  const pipeline = [
    { $match: { event: mongoose.Types.ObjectId(eventId) } },
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
                  location.lng, location.lat,
                ],
              },
              distanceField: 'dist.calculated',
              distanceMultiplier: 1 / 1000,
              spherical: true,
              maxDistance: 9999999,
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

      }
    },
    { $unwind: "$businessObj"},
    { $project: {
        event: 1,
        business: 1,
        start_at: 1,
        end_at: 1,
        distanceFromUser: "$businessObj.dist.calculated",
        reservations: 1,
        offer: 1,
      }},


  ];

  if (pagination._field && pagination._limit) {
    pipeline.push({ $match: { [pagination._field]: pagination._order === 1
          ?  { $gt: pagination._cursor || 0 }
          :  { $lt: pagination._cursor || 0 }
    }});
    pipeline.push({ $sort: { [pagination._field]: pagination._order}});
  };
  if (pagination._limit) {
    pipeline.push({ $limit: pagination._limit });
  }
  const broadcasts = await Broadcast.aggregate(pipeline);

  return broadcasts || [];
}

exports.getBroadcastByEventAndLocation = getBroadcastByEventAndLocation;