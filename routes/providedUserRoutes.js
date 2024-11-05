const express = require('express');
const providedUserController = require('../controllers/providedUserController');

const router = express.Router();

router.get('/all', providedUserController.getAllProvidedUsers);

module.exports = router;