const express = require('express');
const controller = require('../../controllers/v1/contact.controller');
const validate = require('express-validation');

const { createContactRequest } = require('../../validations/contactRequest.validation');


const router = express.Router();

router
.route('/')

.post(validate(createContactRequest), controller.create);


module.exports = router;
