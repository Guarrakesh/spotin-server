const { Competition } = require('../api/models/competition.model');

exports.Competition = `

  extend type Query {
     getCompetitions(name: String): [Competition]
  }
  type NestedSport {
    id: String!
    name: String
  }
  type Competition {
    id: ID!
    name: String
    sport: NestedSport
    competitorsHaveLogo: Boolean
    country: String
    image_versions: [ImageVersion]
    slug: String 
    
  }
`;

exports.competitionResolvers = {
  Query: {
    async getCompetitions(obj, args, context, info) {
      const competitions =  await Competition.find({name: { "$regex": args.name, "$options": "i" }}).limit(args.limit || 10).exec()
      return competitions;
    }
  },

  Competition: {
    sport: async parent => await parent.getSport()
  },

};