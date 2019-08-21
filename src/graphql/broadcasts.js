const { Broadcast } = require('../api/models/broadcast.model');
const { Business } = require('../api/models/business.model');
const { SportEvent } = require('../api/models/sportevent.model');

const mongoose = require('mongoose');
exports.Broadcast = `
  input LocationInput {
    lat: Float!
    lng: Float!
    radius: Float
  }
  input BroadcastFilter {
    types: [String!]
    sort: String
    extras: [String!]
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
    distanceFromUser: Float
    
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


const prepareBroadcastsQuery = (eventId, pagination = {}, filter = {}) => {
  const { types, extras} = filter;
  let businessMatchStage = {
    $expr: {
      $and: [
        {   $eq: [
            '$_id', '$$businessId',
          ]
        }
      ]
    }
  };

  if (types && types.length > 0) {
    // for (const type in types) {
    businessMatchStage.type = { $all: types };
    // }
  }

  if (extras && extras.length > 0) {
    for (const extra in extras) {
      businessMatchStage[extras[extra]] = true;
    }
  }
  const pipeline = [
    { $match: { event: mongoose.Types.ObjectId(eventId) } }
  ];
  if (pagination._cursor) {
    pipeline.push({ $match: { [pagination._field]: pagination._order === 1
            ?  { $gt: pagination._cursor || 0 }
            :  { $lt: pagination._cursor || 0 }
      }});
  }
  if (pagination._field) {
    pipeline.push({ $sort: { [pagination._field]: pagination._order}});
  };

  if (pagination._limit) {
    pipeline.push({ $limit: pagination._limit });
  }
  return pipeline;
};
async function getBroadcastsByEvent(eventId, pagination, filter) {
  const pipeline = prepareBroadcastsQuery(eventId, pagination, filter)
  return await Broadcast.aggregate(pipeline);
}
async function getBroadcastByEventAndLocation(eventId, location, pagination = {}, filter = {}) {
  const locationStages = [
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
              maxDistance: (parseFloat(location.radius) * 1000) || (25*1000),
              includeLocs: 'dist.location',
            },
          }, {
            $match: businessMatchStage

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
        name: "$businessObj.name",
        start_at: 1,
        end_at: 1,
        distanceFromUser: "$businessObj.dist.calculated",
        reservations: 1,
        offer: 1,
      }
    },
  ];
  const _pipeline = prepareBroadcastsQuery(eventId, pagination, filter);
  const pipeline = [_pipeline[0], ...locationStages, _pipeline.slice(1)];
  const broadcasts = await Broadcast.aggregate(pipeline);
  return broadcasts || [];
}

exports.getBroadcastByEventAndLocation = getBroadcastByEventAndLocation;
exports.getBroadcastsByEvent = getBroadcastsByEvent;
