const { Broadcast } = require('../api/models/broadcast.model');
const { Business } = require('../api/models/business.model');
const { SportEvent } = require('../api/models/sportevent.model');
const User = require('../api/models/user.model');
const { Reservation } = require('../api/models/reservation.model');
const { ApolloError, AuthenticationError } = require('apollo-server');
const eventEmitter = require('../api/emitters');

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
    value: Float
    title: String
    description: String
  }
  type ReservationCheer {
    userId: ID!
    cheerFor: String!
  }
  type Reservation {
    id: ID!
    user: ID!
    broadcast: Broadcast
    created_at: Date
    cheers: [ReservationCheer]
    peopleNum: Int
    
  }
  type BroadcastCheers {
    home: Int
    total: Int!
    guest: Int
    other: [String]
  } 
  type Broadcast {
    id: ID!
    event: SportEvent
    business: Business
    offer: Offer
    distanceFromUser: Float
    cheers: BroadcastCheers
    
  }
  extend type Mutation {
    reserve(broadcast: ID!): Reservation
    cheerFor(reservation: ID!, cheerFor: String!): Broadcast
  } 
  
  
  
`;

exports.broadcastResolvers = {
  Query: {
    async getBroadcastsByEventAndLocation(obj, args) {
      return await getBroadcastByEventAndLocation(args.eventId, args.location)
    }

  },
  Mutation: {
    async reserve(obj, args, context) {
      if (!context.user) {
        throw new AuthenticationError();
      }

      // TODO: portare tutto in una repository/service
      const { user } = context;
      const broadcastId = args.broadcast;
      const broadcast = await  Broadcast.findById(broadcastId);
      if (!broadcast) {
        throw new ApolloError("Questa trasmissione non esiste",404);
      }
      if (broadcast.reservations.find(r => r.user.toString() === user._id.toString())) {
        throw new ApolloError("Hai già prenotato questa offerta.",400);
      }
      const reservation = new Reservation({
        user: { _id: user._id, name: user.name, lastname: user.lastname, email: user.email },
        broadcast: broadcast,
        created_at: (new Date()).toISOString(),
        peopleNum: args.peopleNum,
      });
      const operations =  { $push: {reservations: reservation}};
      const updatedBroadcast = await Broadcast.findOneAndUpdate({_id: broadcastId}, operations, {
        new: true
      });
      const reservationId = updatedBroadcast.reservations[updatedBroadcast.reservations.length - 1]._id;
      await User.findOneAndUpdate({_id: user._id},
          { $push: {reservations: new mongoose.mongo.ObjectId(reservationId)}});

      reservation.broadcast = updatedBroadcast;
      const event = await broadcast.getEvent();
      const business = await broadcast.getBusiness();
      eventEmitter.emit('user-reservation', user, reservation, event.name, business.name);

      return reservation;
    },
    async cheerFor(obj, { reservation, cheerFor }, context) {
      if (!context.user) {
        throw new AuthenticationError();
      }
      const { user } = context;

      const updatedBroadcast = await Broadcast.findOneAndUpdate({
        "reservations._id": reservation,
        "reservations.cheers.userId": { $ne: user.id }
      }, {
        $push: { 'reservations.$.cheers': { userId: user._id, cheerFor } },
        $inc: {
          'cheers.total': 1,
          'cheers.home': cheerFor === "__home__" ? 1 : 0,
          'cheers.guest': cheerFor === "__guest__" ? 1 : 0,
        },

      }, { new: true });
      if (!updatedBroadcast) {
        return await Broadcast.findOne({ "reservations._id" : reservation });
      }
      return updatedBroadcast;

    }
  },
  Reservation: {
    broadcast: async parent => Broadcast.findById(parent.broadcast),
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
  return [businessMatchStage, pipeline];
};
async function getBroadcastsByEvent(eventId, pagination, filter) {
  const [businessMatchStage, _pipeline] = prepareBroadcastsQuery(eventId, pagination, filter);
  const pipeline = [
    _pipeline[0],
    {
      $lookup: {
        from: 'businesses',
        let: {businessId: '$business'},
        as: 'businessObj',
        pipeline: [
          {
            $match: businessMatchStage,
          },

        ]
      },
    },
    { $unwind: "$businessObj"},

    { $project: {
        event: 1,

        business: 1,
        name: "$businessObj.name",
        start_at: 1,
        end_at: 1,
        reservations: 1,
        recommended: { $ifNull: ["$businessObj.isRecommended", false] },
        offer: 1,
      }
    }
  , ..._pipeline.slice(1)];
  return await Broadcast.aggregate(pipeline);
}
  async function getBroadcastByEventAndLocation(eventId, location, pagination = {}, filter = {}) {
    const [businessMatchStage, _pipeline] = prepareBroadcastsQuery(eventId, pagination, filter);

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
          recommended: { $ifNull: ["$businessObj.isRecommended", false] },
          name: "$businessObj.name",
          start_at: 1,
          end_at: 1,
          distanceFromUser: "$businessObj.dist.calculated",
          reservations: 1,
          offer: 1,
        }
      },
    ];
    const pipeline = [_pipeline[0], ...locationStages, ..._pipeline.slice(1)];
    const broadcasts = await Broadcast.aggregate(pipeline);
    return broadcasts || [];
  }

  exports.getBroadcastByEventAndLocation = getBroadcastByEventAndLocation;
  exports.getBroadcastsByEvent = getBroadcastsByEvent;
