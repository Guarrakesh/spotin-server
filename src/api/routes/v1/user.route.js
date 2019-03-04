const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/v1/user.controller.js');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const {
  listUsers,
  createUser,
  replaceUser,
  updateUser,
  addFavoriteEvent,
  removeFavoriteEvent,
  reserveBroadcast,
  removeReservation,
  listReservations,
  listFavoriteEvents,
  requestBroadcast,
  getReservation,
  registerFcmToken
} = require('../../validations/user.validation');

const router = express.Router();



const ownerCheck  = (req, loggedUser) => {
  return req.params && req.params.userId && req.params.userId.toString() === loggedUser._id.toString();
};

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', controller.load);



router
  .route('/profile')
  /**
   * @api {get} v1/users/profile User Profile
   * @apiDescription Get logged in user profile information
   * @apiVersion 1.0.0
   * @apiName UserProfile
   * @apiGroup User
   * @apiPermission user
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {String}  id         User's id
   * @apiSuccess {String}  name       User's name
   * @apiSuccess {String}  email      User's email
   * @apiSuccess {String}  role       User's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated Users can access the data
   */
  .get(authorize(LOGGED_USER), controller.loggedIn);


router
  .route('/:userId')
  /**
   * @api {get} v1/users/:id Get User
   * @apiDescription Get user information
   * @apiVersion 1.0.0
   * @apiName GetUser
   * @apiGroup User
   * @apiPermission user
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {String}  id         User's id
   * @apiSuccess {String}  name       User's name
   * @apiSuccess {String}  email      User's email
   * @apiSuccess {String}  role       User's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     User does not exist
   */
  .get(authorize(LOGGED_USER, ownerCheck), controller.get)

  /**
   * @api {patch} v1/users/:id Update User
   * @apiDescription Update some fields of a user document
   * @apiVersion 1.0.0
   * @apiName UpdateUser
   * @apiGroup User
   * @apiPermission user
   *
   * @apiHeader {String} Athorization  User's access token
   *
   * @apiParam  {String}             email     User's email
   * @apiParam  {String{6..128}}     password  User's password
   * @apiParam  {String{..128}}      [name]    User's name
   * @apiParam  {String=user,admin}  [role]    User's role
   * (You must be an admin to change the user's role)
   *
   * @apiSuccess {String}  id         User's id
   * @apiSuccess {String}  name       User's name
   * @apiSuccess {String}  email      User's email
   * @apiSuccess {String}  role       User's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     User does not exist
   */
  .patch(authorize(LOGGED_USER,ownerCheck), validate(updateUser), controller.update)
  /**
   * @api {patch} v1/users/:id Delete User
   * @apiDescription Delete a user
   * @apiVersion 1.0.0
   * @apiName DeleteUser
   * @apiGroup User
   * @apiPermission user
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated users can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only user with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      User does not exist
   */
  .delete(authorize(LOGGED_USER, ownerCheck), controller.remove);

router
    .route('/:userId/picture_upload_url')
    .get(authorize(LOGGED_USER, ownerCheck), controller.getPictureUploadURL);


router
  .route('/:userId/events')
  .post(authorize(LOGGED_USER, ownerCheck), validate(addFavoriteEvent), controller.addFavoriteEvent)
  .get(authorize(LOGGED_USER, ownerCheck), validate(listFavoriteEvents), controller.listFavoriteEvents);

router
  .route('/:userId/events/:eventId')
  .delete(authorize(LOGGED_USER, ownerCheck), validate(removeFavoriteEvent), controller.removeFavoriteEvent)
;

router
  .route('/:userId/reservations')
  .get(authorize(LOGGED_USER, ownerCheck), validate(listReservations), controller.listReservations)
  .post(authorize(LOGGED_USER, ownerCheck), validate(reserveBroadcast), controller.reserveBroadcast)
;
router
  .route('/:userId/reservations/:reservationId')
  .get(authorize(LOGGED_USER, ownerCheck), validate(getReservation), controller.getReservation)
  .delete(authorize(LOGGED_USER, ownerCheck), validate(removeReservation), controller.removeReservation)
;

router
  .route('/:userId/requests')
  /**
   * @api {post} v1/users/:userId/requests Crea una richiesta di Broadcast
   * @apiDescription Crea una richiesta di Broadcasrt per l'utente
   * @apiVersion 1.0.0
   * @apiName BroadcastUserRequest
   * @apiPermission user
   * @apiGroup User
   *
   * @apiHeader {String} Authorization User's access token
   *
   * @apiParam  {ObjectId}             event          SportEvent's id
   * @apiParam  {Number}               maxDistance    Max distance (in Kilometers)
   * @apiParam  {Number}               numOfPeople    Number of people
   * @apiParam  {Object}            userPosition   User position (to watch Event)
   * @apiParam  {String{1..250}}             userPosition.latitude      Position latitude
   * @apiParam  {String}             userPosition.longitude     Position longitude
   * @apiParam {String}                note           Additional notes
   *
   * @apiSuccess (No content 204) Richiesta inviata correttamente
   *
   * @apiError (Unauthorized 401) Unauthorized Solo gli utenti autenticati e padroni della risorsa :userId possono accedere
   * @apiError (Not Found 404) Not Found  L'evento specificato non esiste
   */
  .post(authorize(LOGGED_USER, ownerCheck), validate(requestBroadcast), controller.requestBroadcast)

  .get(authorize(LOGGED_USER, ownerCheck), controller.listBroadcastRequests);

router
  .route("/:userId/fcm_tokens")
  .post(authorize(LOGGED_USER, ownerCheck), validate(registerFcmToken), controller.registerFcmToken);
module.exports = router;
