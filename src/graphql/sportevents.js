const { SportEvent } = require('../api/models/sportevent.model');
const { getBroadcastByEventAndLocation } = require('./broadcasts');
const { fromCursorHash, toCursorHash } = require('./utils');
const get = require('lodash').get;
const omit = require('lodash').omit;
exports.SportEvent = `

  extend type Query {
    getSportEvents(name: String, inTheFuture: Boolean): [SportEvent]
    getSportEventWithBroadcasts(id: ID!, location: LocationInput, limit: Int): SportEvent
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
    broadcasts(cursor: String, location: LocationInput, filter: BroadcastFilter, limit: Int): SportEventBroadcastsConnection
  }
  type SportEventBroadcastsConnection {
    pageInfo: PageInfo!
    edges: [SportEventBroadcastsEdge!]!
    
  }
  type SportEventBroadcastsEdge {
    cursor: String!
    distanceFromUser: Float
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
      const cursorOptions = {
        _field: filter.sort || 'distanceFromUser',
        _cursor: cursor ? fromCursorHash(cursor) : 0,
        _limit: limit + 1,
        _order: 1,
      };


      if (cursorOptions._field === "distanceFromUser") {
        // Converto in float se è una distanza affinché mongo faccia bene il sorting
        cursorOptions._cursor = parseFloat(cursorOptions._cursor);
      }
      const broadcasts = await getBroadcastByEventAndLocation(sportEvent.id, location, cursorOptions, filter);
      // Controllo se ci sono altri edge
      const hasNextPage = broadcasts.length > limit;
      const nodes = (hasNextPage ? broadcasts.slice(0, -1) : broadcasts);
      console.log(get(nodes[nodes.length - 1], cursorOptions._field));
      return  {
        edges: nodes.map(e => ({
          node: omit(e, ['distanceFromUser']),
          cursor: toCursorHash(get(e, cursorOptions._field).toString()),
          distanceFromUser: e.distanceFromUser
        })),
        pageInfo: {
          startCursor: nodes.length > 0 ? toCursorHash(get(nodes[0], cursorOptions._field).toString()) : undefined,
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
