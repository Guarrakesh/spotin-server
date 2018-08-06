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
const { slugify } = require('lodash-addons');
const sandbox = sinon.createSandbox();

const JWT_EXPIRATION = require('../../../config/vars').jwtExpirationInterval;


describe('Sports API', async () => {
  let userAccessToken;
  let adminAccessToken;

  let admin;
  let sport;
  let newSport;
  let dbUsers;
  let dbSports;
  const password = '123456';
  const passwordHashed = await bcrypt.hash(password,1);


  beforeEach(async () => {


    dbSports = {
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

    };
    dbUsers = {
      branStark: {
        email: 'branstark@gmail.com',
        password: passwordHashed,
        name: 'Bran Stark',
        role: 'admin',
        username: "branstark"
      },
      jonSnow: {
        email: 'jonsnow@gmail.com',
        password: passwordHashed,
        name: 'Jon Snow',
        username: "__jonsnow"
      },
    };

    await User.remove({});

    await Sport.remove({});
    await Sport.insertMany([dbSports.calcio, dbSports.tennis], (err, docs) => {
      sport = docs[0];
    });


  });
  afterEach(async () => { sandbox.restore() });


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


  });

  describe('POST /v1/sports', () => {
    it('should create a new Sport when request is ok', async () => {
      await User.remove({});
      await User.insertMany([dbUsers.branStark]);
      dbUsers.branStark.password = password;
      adminAccessToken = (await User.findAndGenerateToken(dbUsers.branStark)).accessToken;
      return request(app)
        .post('/v1/sports')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newSport)
        .expect(httpStatus.CREATED)
        .then( (res) => {
          expect(res.body.name).to.be.equal(newSport.name);
          expect(res.body.slug).to.be.equal(slugify(newSport.name));
        })
    });

    it('Should take the sport slug if given', async () => {
      await User.remove({});
      await User.insertMany([dbUsers.branStark]);
      dbUsers.branStark.password = password;
      adminAccessToken = (await User.findAndGenerateToken(dbUsers.branStark)).accessToken;
      newSport.slug = "slugtest";
      return request(app)
        .post('/v1/sports')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newSport)
        .expect(httpStatus.CREATED)
        .then( (res) => {
          expect(res.body.name).to.be.equal(newSport.name);
          expect(res.body.slug).to.be.equal("slugtest");
        })
    });
    it('Should return validation error if name length is < 6', async () => {
      await User.remove({});
      await User.insertMany([dbUsers.branStark]);
      dbUsers.branStark.password = password;
      adminAccessToken = (await User.findAndGenerateToken(dbUsers.branStark)).accessToken;
      newSport.name = "aa";

      return request(app)
        .post('/v1/sports')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newSport)
        .expect(httpStatus.BAD_REQUEST)
        .then( (res) => {
          expect(res.body.message).to.be.equal("Validation Error");

        })
    });
  });
  describe('PATCH /v1/sport/:id', () => {
    it('should update the sport (name and slug)', async () => {
      const id = (await Sport.findOne(dbSports.calcio))._id;
      await User.remove({});
      await User.insertMany([dbUsers.branStark]);
      dbUsers.branStark.password = password;
      adminAccessToken = (await User.findAndGenerateToken(dbUsers.branStark)).accessToken;
      return request(app)
        .patch(`/v1/sports/${id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({"name": "Soccerball"})
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).to.be.equal('Soccerball');
          expect(res.body.slug).to.be.equal('soccerball');
        })
    });
    it('should not update sport when no parameters were given', async () => {
      const id = (await Sport.findOne(dbSports.calcio))._id;
      await User.remove({});
      await User.insertMany([dbUsers.branStark]);
      dbUsers.branStark.password = password;
      adminAccessToken = (await User.findAndGenerateToken(dbUsers.branStark)).accessToken;
      return request(app)
        .patch(`/v1/sports/${id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.include(dbSports.calcio);
        })
    });
    it('should report error if sport does not exists', async () => {
      let id = "aaaa0000";
      await User.remove({});
      await User.insertMany([dbUsers.branStark]);
      dbUsers.branStark.password = password;
      adminAccessToken = (await User.findAndGenerateToken(dbUsers.branStark)).accessToken;
      return request(app)
        .patch(`/v1/sports/${id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND)
        ;
    });
  });

  describe('DELETE /v1/sports', () => {
    it('Should delete a sport', async () => {
      const id = (await Sport.findOne(dbSports.calcio))._id;
      await User.remove({});
      await User.insertMany([dbUsers.branStark]);
      dbUsers.branStark.password = password;
      adminAccessToken = (await User.findAndGenerateToken(dbUsers.branStark)).accessToken;

      return request(app)
        .delete(`/v1/sports/${id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.NO_CONTENT)
        .then(async () => {
          const sports = await Sport.find({});
          //Eliminando il calcio, resta solo il tennis nel db
          expect(sports).to.have.lengthOf(1);
        })
    });
    it('Should report error if sport does not exists', async () => {
      let id = "aaaa0000";
      await User.remove({});
      await User.insertMany([dbUsers.branStark]);
      dbUsers.branStark.password = password;
      adminAccessToken = (await User.findAndGenerateToken(dbUsers.branStark)).accessToken;
      return request(app)
        .delete(`/v1/sports/${id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND)
        ;
    })
  })

});
