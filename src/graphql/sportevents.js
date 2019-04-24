const { SportEvent } = require('../api/models/sportevent.model');

exports.SportEvent = `

  extend type Query {
    getSportEvents(name: String, inTheFuture: Boolean): [SportEvent]
  }
    type NestedCompetition {
    id: String!
    name: String
  }
  type NestedCompetitor {
    id: String!
    name: String!
    image_versions: [ImageVersion]
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
    }
  },

  SportEvent: {
    sport: async parent => await parent.getSport(),
    competition: async parent => await parent.getCompetition(),
    competitors: async parent => await parent.getCompetitors(),
  },

};