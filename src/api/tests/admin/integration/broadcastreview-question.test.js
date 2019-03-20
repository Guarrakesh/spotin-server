const request = require('supertest');
const httpStatus = require('http-status');
const { isEqual } = require('lodash');
const app = require('../../../../index');
const { expect } = require('chai');
const { factory } = require('../../../factories/Factory');
const User = require("../../../models/user.model");
const { BroadcastReviewQuestion } = require('../../../models/review-question.model');
let admin, questions;


describe('BroadcastReviewQuestion API', async () => {
  beforeEach(async () => {
    admin = await factory(User, 'admin').create({ password: '123456'});
    admin.password = '123456';
    adminAccessToken = (await User.findAndGenerateToken(admin)).accessToken;

    BroadcastReviewQuestion.deleteMany({});
    questions = await factory(BroadcastReviewQuestion, null, 4).create();
  });
  afterEach(async () => {
    await BroadcastReviewQuestion.deleteMany({});
  });
  describe('GET /v1/broadcastreview_questions', () => {
    it('Should return broadcast review question', () => {
      return request(app)
          .get('/admin/broadcastreview_questions')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .expect(httpStatus.OK)
          .then(res => {
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.lengthOf(4);
          })
    });
  });


  describe('POST /v1/broadcastreview_questions', () => {
    it('Should create a broadcast review question', async () => {
      const newQuestion = await factory(BroadcastReviewQuestion).make();
      return request(app)
          .post('/admin/broadcastreview_questions')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(newQuestion)
          .expect(httpStatus.CREATED)
          .then(res => {
            expect(res.body.text).to.be.equal(newQuestion.text);
            expect(res.body.offeredAnswers).to.have.lengthOf(newQuestion.offeredAnswers.length)
          })
    });
    it('Should return validation error on required text and offered answers', async () => {
      const newQuestion = await factory(BroadcastReviewQuestion).make();
      newQuestion.text = undefined;
      newQuestion.offeredAnswers = undefined;
      return request(app)
          .post('/admin/broadcastreview_questions')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(newQuestion)
          .expect(httpStatus.BAD_REQUEST)
          .then(res => {
            expect(res.body.code).equal(400);
            expect(res.body.message).equal('Validation Error');
            expect(res.body.errors).to.be.an('array');
            expect(res.body.errors[0].field).equal('text');
            expect(res.body.errors[1].field).equal('offeredAnswers');
            expect(res.body.errors[0].messages[0]).equal('"text" is required');
            expect(res.body.errors[1].messages[0]).equal('"offeredAnswers" is required');

          });
    });
    it('Should return validation error when offeredAnswers is empty', async () => {
      const newQuestion = await factory(BroadcastReviewQuestion).make({
        offeredAnswers: []
      });

      return request(app)
          .post('/admin/broadcastreview_questions')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(newQuestion)
          .expect(httpStatus.BAD_REQUEST)
          .then(res => {
            expect(res.body.code).equal(400);
            expect(res.body.message).equal('Validation Error');
            expect(res.body.errors).to.be.an('array');
            expect(res.body.errors[0].field).equal('offeredAnswers');
            expect(res.body.errors[0].messages[0]).equal('"offeredAnswers" must contain at least 1 items');

          });
    });
    it('Should set default order and multiplier when none given', async () => {
      const newQuestion = await factory(BroadcastReviewQuestion).make({
        multiplier: undefined,
        order: undefined,
      });

      return request(app)
          .post('/admin/broadcastreview_questions')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(newQuestion)
          .expect(httpStatus.CREATED)
          .then(res => {
            expect(res.body.multiplier).equal(1);
            expect(res.body.order).equal(1);
          });
    });
  });

  describe('GET /v1/broadcastreview_questions/:id', () => {
    it('Should get a broadcast review question',  () => {
      return request(app)
          .get(`/admin/broadcastreview_questions/${questions[0]._id}`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .expect(httpStatus.OK)
          .then(res => {
            expect(res.body).to.be.an('object');
            expect(res.body._id).to.equal(questions[0].id)
          })

    })
  })

  describe('PATCH /v1/broadcastreview_questions/:id', () => {
    it('Should update an existing broadcast review',  () => {
      return request(app)
          .patch(`/admin/broadcastreview_questions/${questions[0]._id}`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send({
            order: 10,
            text: "Come va la vita?",
            offeredAnswers: [
              { value: 1, text: "Benino"}, {value: 2, text: "Insomma..." }, {value: 3, text: "'Na bomba!" }
            ]
          })
          .expect(httpStatus.OK)
          .then(res => {
            expect(res.body.order).equal(10);
            expect(res.body.multiplier).equal(questions[0].multiplier);
            expect(res.body._id).equal(questions[0].id);
            expect(res.body.text).equal("Come va la vita?");
            expect(res.body.offeredAnswers).to.be.an('array');
            expect(res.body.offeredAnswers).to.have.lengthOf(3);
            expect(res.body.offeredAnswers[0]).to.include({value: 1, text: "Benino"});
            expect(res.body.offeredAnswers[1]).to.include({value: 2, text: "Insomma..."});
            expect(res.body.offeredAnswers[2]).to.include({value: 3, text: "'Na bomba!"});
          })
    });
    it('Should return validation error if offeredAnswers is empty',  () => {
      return request(app)
          .patch(`/admin/broadcastreview_questions/${questions[0]._id}`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send({
            offeredAnswers: []
          })
          .expect(httpStatus.BAD_REQUEST)
          .then(res => {
            expect(res.body.code).equal(400);
            expect(res.body.message).equal('Validation Error');
            expect(res.body.errors).to.be.an('array');
            expect(res.body.errors[0].field).equal('offeredAnswers');
            expect(res.body.errors[0].messages[0]).equal('"offeredAnswers" must contain at least 1 items');
          })
    });
    it('Should return validation error if multiplier is not a number',  () => {
      return request(app)
          .patch(`/admin/broadcastreview_questions/${questions[0]._id}`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send({
            multiplier: "notANumber",
          })
          .expect(httpStatus.BAD_REQUEST)
          .then(res => {
            expect(res.body.code).equal(400);
            expect(res.body.message).equal('Validation Error');
            expect(res.body.errors).to.be.an('array');
            expect(res.body.errors[0].field).equal('multiplier');
            expect(res.body.errors[0].messages[0]).equal('"multiplier" must be a number');
          })
    });


  })



});
