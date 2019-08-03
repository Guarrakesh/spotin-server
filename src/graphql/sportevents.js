const { SportEvent } = require('../api/models/sportevent.model');
const { getBroadcastByEventAndLocation } = require('./broadcasts');
const { fromCursorHash, toCursorHash } = require('./utils');
const get = require('lodash').get;
exports.SportEvent = `

  extend type Query {
    getSportEvents(name: String, inTheFuture: Boolean): [SportEvent]
    getSportEventWithBroadcasts(id: ID!, location: LocationInput): SportEvent
  }

  type NestedCompetition {
    id: String!
    name: String
    image_versions: [ImageVersion]
    competitorsHaveLogo: Boolean
    color: String
  }
  type NestedCompetitor {
    id: String!
    name: String!
    image_versions: [ImageVersion]
   color: String
  }
  
  type SportEvent {
    id: ID!
    name: String
    sport: NestedSport!
    competition: NestedCompetition
    competitors: [NestedCompetitor]
    description: String
    start_at: String!
    providers: [String]!
    broadcasts(cursor: String, location: LocationInput, filter: BroadcastFilter): SportEventBroadcastsConnection
  }
  type SportEventBroadcastsConnection {
    pageInfo: PageInfo!
    edges: [SportEventBroadcastsEdge!]!
    
  }
  type SportEventBroadcastsEdge {
    cursor: String!
    node: Broadcast!
  }
  
`;

exports.sportEventResolvers = {
  Query: {
    async getSportEvents(obj, args, context, info) {
      const options = {
        name: { "$regex": args.name, "$options": "i" },
      };
      if (args.inTheFuture) {
        options.start_at =  { $gte: Date.now() };

      }

      return SportEvent.find(options).limit(args.limit || 10).sort({start_at: 1})
    },
    async getSportEventWithBroadcasts(obj, args) {
      return SportEvent.findById(args.id);
    }
  },

  SportEvent: {
    sport: async parent => await parent.getSport(),
    competition: async parent => await parent.getCompetition(),
    competitors: async parent => await parent.getCompetitors(),

    broadcasts: async (sportEvent, { cursor, location, filter = {}, limit = 5}) => {
      console.log("aaa", filter);
      const cursorOptions = {
            _field: filter.sort || 'distanceFromUser',
            _cursor: cursor ? parseFloat(fromCursorHash(cursor)) : 0,
            _limit: limit + 1,
            _order: 1,
          };


      const broadcasts = await getBroadcastByEventAndLocation(sportEvent.id, location, cursorOptions, filter);
      // Controllo se ci sono altri edge
      const hasNextPage = broadcasts.length > limit;
      const nodes = hasNextPage ? broadcasts.slice(0, -1) : broadcasts;
      return  {
        edges: nodes.map(e => ({ node: e, cursor: toCursorHash(get(e, cursorOptions._field).toString())})),
        pageInfo: {
          hasNextPage,
          endCursor: nodes.length === limit
              ? toCursorHash(get(nodes[nodes.length - 1], cursorOptions._field).toString())
              : cursor,
        }

      };

    }

  },
  NestedCompetition: {
    color: async parent => await parent.getColorLazy(),
  },
  NestedCompetitor: {
    color: async parent => await parent.getColorLazy(),
  }

};
