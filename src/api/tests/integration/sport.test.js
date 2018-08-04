/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-expressions */

const request = require('supertest');
const httpStatus = require('http-status');
const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcryptjs')
const { some, omit, isNil } = require('lodash');
const app = require('../../../index');

const { Sport } = require('../../models/sport.model');
const User = require('../../models/user.model');

const sandbox = sinon.createSandbox();

const JWT_EXPIRATION = require('../../../config/vars').jwtExpirationInterval;

describe('Sports API', async () => {
  let userAccessToken;
  let adminAccessToken;
  let dbUser;
  let user;
  let admin;
  let sport;
  let newSport;

  const password = '123456';
  const passwordHashed = await bcrypt.hash(password,1);



  let dbSports = {
    calcio: {
      name: "Calcio",
      slug: "football",
      active: true
    },
    tennis:{
      name: "Tennis",
      slug: "tennis",
      active: true
    }
  };

  newSport = {
    name: "Pallanuoto",
    active: true,

  },
  beforeEach(async () => {
    user = {
      email: 'guarrakesh@email.com',
      password,
      name: 'Dario Guarracino',
      username: 'Guarrakesh'
    };
    admin = {
      email: 'sousa.dfs@gmail.com',
      password,
      name: 'Dario Guarra',
      role: 'admin',
      username: 'guarrakesh'
    };

    await User.remove({});
    await Sport.remove({});
    await Sport.insertMany([dbSports.calcio, dbSports.tennis], (err, docs) => {
      sport = docs[0];
    });


    await User.insert(admin).exec();

    adminAccessToken = (await User.findAndGenerateToken(admin)).accessToken;

  });



  describe('GET /v1/sports', () => {


    it('should return all active sports', async () => {
      return request(app)
        .get('/v1/sports')
        .expect(httpStatus.OK)
        .then((res) => {

          /*  const calcio = format(dbSports.calcio);
           const tennis = format(dbSports.tennis);*/

          const includesCalcio = some(res.body, dbSports.calcio);
          const includesTennis = some(res.body, dbSports.tennis);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf(2);
          expect(includesCalcio).to.be.true;
          expect(includesCalcio).to.be.true;
        })
    });

    it('should return a sport', async () => {

      return request(app)
        .get(`/v1/sports/${sport._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('Object');
          expect(res.body).to.include(dbSports.calcio);
        })
    });
    it('should return Sport not found', async () => {
      return request(app)
        .get('/v1/sports/aaa0000')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.be.equal('Sport does not exist');

        });
    });

    it('should create a new Sport when request is ok', async () => {

      return request(app)
        .post('/v1/sports')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newSport)
        .expect(httpStatus.CREATED)
        .then((res) => {
          expect(res.body.name).to.be.equal(newSport.name);
        })
    })

  });

});
