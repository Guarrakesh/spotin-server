const { merge } = require('lodash');
const { makeExecutableSchema } = require("graphql-tools");

const Query = `
  type Query {
    author(id: Int!): Post
    
  }`
;

const { Competition, competitionResolvers } = require('./competitions');
const { ImageVersion } = require('./imageversion');
const { SportEvent, sportEventResolvers } = require('./sportevents');
const { Business, businessResolvers } = require('./businesses');
const { Broadcast, broadcastResolvers } = require('./broadcasts');
const { UserSubscription, userSubscriptionResolvers } = require('./usersubscriptions');
const { Sport } = require('./sports');
const types = `
  
  type Mutation {
    # The id of the object.
    id: ID!
  }

   interface Node {
      # The id of the object.
      id: ID!
   }

  # Information about pagination in a connection.
  type PageInfo {
    # When paginating forwards, are there more items?
    hasNextPage: Boolean
  
    # When paginating backwards, are there more items?
    hasPreviousPage: Boolean
  
    # When paginating backwards, the cursor to continue.
    startCursor: String
  
    # When paginating forwards, the cursor to continue.
    endCursor: String
    
 
    
  }

  union Searchable = SportEvent | Competition
  type Query {
    # Fetches an object given its ID
    node(
      # The ID of an object
      id: ID!
    ): Node
    search(input: SearchInput!): [Searchable!]!
  }
  
  input SearchInput {
    name: String!
    entityLimit: Int
    onlyEvents: Boolean
  }
  scalar Date

 

`;


const searchResolvers = {
  Query: {
    async search(parent, args, c, i) {
      const searchArgs = {
        ...args.input,
        limit: args.input.entityLimit,
      };

      const results = [
          ...(await sportEventResolvers.Query.getSportEvents(parent, {
          ...searchArgs,
          inTheFuture: true,
        }, c, i)),
      ];
      if (!args.onlyEvents) {
        results.push(...(await competitionResolvers.Query.getCompetitions(parent, searchArgs, c, i)));
      }
      return results;
    },
  },
  Searchable: {
    __resolveType(obj) {
      if (obj.start_at) { return 'SportEvent' }
      return 'Competition';
    }
  }

};



module.exports = makeExecutableSchema({
  typeDefs: [ImageVersion, Sport, Competition, SportEvent, Business, Broadcast, UserSubscription, types],
  resolvers: merge(
      searchResolvers,
      competitionResolvers,
      sportEventResolvers,
      businessResolvers,
      broadcastResolvers,
      userSubscriptionResolvers

  ),

});
