const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/v1/sport.controller.js');
const { authorize, ADMIN, LOGGED_USER, BUSINESS } = require('../../middlewares/auth');
const eventController = require('../../controllers/v1/sportevent.controller.js');
const competitionController = require('../../controllers/v1/competition.controller.js');
const router = express.Router();


const { createSport, replaceSport, updateSport} = require('../../validations/sport.validation');
const { createCompetition, updateCompetition } = require('../../validations/competition.validation');

/**
 * Load user when API with userId route parameter is hit
 */
router.param('id', controller.load);

router
  .route('/')
  .get(controller.list)
  /**
   * @api {patch} v1/sports Create a Sport
   * @apiDescription Create a new Sport
   * @apiVersion 1.0.0
   * @apiName CreateSport
   * @apiGroup Sport
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String{6..128}}    name       Sport's name
   * @apiParam  {String{6..128}}   slug       Sport's slug
   * @apiParam  {Boolean}          active     Sport status
   *
   * @apiParam  {String{6..128}}    name       Sport's name
   * @apiParam  {String{6..128}}   slug       Sport's slug
   * @apiParam  {Boolean}          active     Sport status
   * @apiParam  {Number}            _id       Sport's ID
   *
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated admin can create the data
   */
  .post(authorize(ADMIN), validate(createSport), controller.create)

  ;

router
  .route('/:id')

  .get(controller.get)



  /**
   * @api {patch} v1/sports/:id Update Sport
   * @apiDescription Update some fields of a sport document
   * @apiVersion 1.0.0
   * @apiName UpdateSport
   * @apiGroup Sport
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String{6..128}}    name       Sport's name
   * @apiParam  {String{6..128}}   slug       Sport's slug
   * @apiParam  {Boolean}          active     Sport status
   *
   * @apiParam  {String{6..128}}    name       Sport's name
   * @apiParam  {String{6..128}}   slug       Sport's slug
   * @apiParam  {Boolean}          active     Sport status
   * @apiParam  {Number}            _id       Sport's ID
   *
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated admin can modify the data
   * @apiError (Not Found 404)    NotFound     Sport does not exist
   */
  .patch(authorize(ADMIN), validate(updateSport), controller.update)
  /**
   * @api {delete} /v1/sports/:sportId Delete sport
   * @apiDescription Delete a sport
   * @apiVersion 1.0.0
   * @apiName DeleteSport
   * @apiGroup Sport
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization Admin's access token
   *
   * @apiSuccess (No Content 204) Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only admins can delete the sport
   * @apiError (Not Found 404)    NotFound      Sport does not exist
   */
  .delete(authorize(ADMIN), controller.remove);




module.exports = router;
