/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-expressions */

const request = require('supertest');
const httpStatus = require('http-status');
const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcryptjs')
const { some, omitBy, isNil } = require('lodash');
const app = require('../../../index');

const Sport = require('../../models/sport.model');
const User = require('../../models/user.model');

const sandbox = sinon.createSandbox();

const JWT_EXPIRATION = require('../../../config/vars').jwtExpirationInterval;

describe('Sports API', async () => {
  let userAccessToken;
  let adminAccessToken;
  let dbUser;
  let user;
  let admin;

  const password = '123456';
  const passwordHashed = await bcrypt.hash(password,1);




  beforeEach(async () => {
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
    await Sport.insertMany([dbSports.calcio, dbSports.tennis]);

    await User.create(admin);


    adminAccessToken = (await User.findAndGenerateToken(admin)).accessToken;

  });
  afterEach(() => sandbox.restore());


  describe('GET /v1/sports', () => {
    it('should reject the request if accessToken is not provided', () => {
      return request(app)
        .get('/v1/sports')
        .send(user)
        .expect(httpStatus.UNAUTHORIZED)
        .then((res) => {
          delete admin.password;

          expect(res.body.message).to.be.equal("No auth token");

        });
    });
    it('should reject the request if accessToken is expired', async () => {
      const clock = sinon.useFakeTimers();
      const expiredAccessToken = adminAccessToken;

      //Faccio scadere la token
      clock.tick((JWT_EXPIRATION * 60000) + 60000);

      return request(app)
        .get('/v1/sports')
        .set('Authorization', `Bearer ${expiredAccessToken}`)
        .expect(httpStatus.UNAUTHORIZED)
        .then((res) => {
          delete admin.password;

          expect(res.body.message).to.be.equal("Unauthorized");

        });
    });

    it('should return all active sports', async () => {
      return request(app)
        .get('/v1/sports')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.OK)
        .then((res) => {

          /*  const calcio = format(dbSports.calcio);
           const tennis = format(dbSports.tennis);*/

          const includesCalcio = some(res.body, dbSports.calcio);
          const includesTennis = some(res.body, dbSports.tennis);
          expect(res.body.to.be.an('array'));
          expect(res.body.to.have.lengthOf(2));
          expect(includesCalcio).to.be.true;
          expect(includesCalcio).to.be.true;
        })
    });

  });

});
