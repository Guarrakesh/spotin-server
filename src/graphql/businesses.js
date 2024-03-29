const { Business } = require('../api/models/business.model');
const { ObjectId } = require('bson');
const { ApolloError } = require('apollo-server');
const { verifyRecaptchaV3 } = require('../api/utils/google');
exports.Business = `
  extend type Query {
    getBusiness(id: String): Business
    getBusinesses: [Business]
    getRecommendedBusinesses(count: Int!): [Business]
  }
  
  type Point {
    type: String
    latitude: String
    longitude: String
  }
  type Address {
    street: String
    number: String
    zip: String
    city: String
    province: String
    country: String
    location: Point
  }

  type DayOpening {
      open: Int
      close: Int
  }
  type BusinessHours {
    openings: [DayOpening]!
    crossing_day_close: Int
  }

  type Business {
    id: ID!
    name: String
    address: Address
    phone: String
    tvs: Int
    seats: Int
    wifi: Boolean
    target: String
    forFamilies: Boolean
    business_hours: [BusinessHours]
    pictures: [Image]
    cover_versions: [ImageVersion]
    quickerMenuURL: String
    type: [String]
    fullAddress: String
  }
  

`;


exports.businessResolvers = {
  Query: {
    async getBusinesses(obj, args, context, info) {
      return await Business.find({...args});
    },
    async getRecommendedBusinesses(_, args = {}) {
      return await Business.find({ isRecommended: true}).limit(args.count || 6).exec();
    },
    async getBusiness(_, { id }) {
      if (!ObjectId.isValid(id)) throw new ApolloError('resource_not_found', 404);
      return await Business.findOne({ _id: id }).exec();
    }
  },

  Business: {
    business_hours: parent => {
      if (!parent.business_hours) return [];

      return [
        parent.business_hours[6],
        parent.business_hours[0],
        parent.business_hours[1],
        parent.business_hours[2],
        parent.business_hours[3],
        parent.business_hours[4],
        parent.business_hours[5],
      ]
    },
    fullAddress: parent => `${parent.address.street} ${parent.address.number} (${parent.address.city})`



  },
  Point: {
    latitude: parent => parent.coordinates[1],
    longitude: parent => parent.coordinates[0],
  },



};