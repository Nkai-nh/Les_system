const express = require('express');
const deliveryAddressController = require('../controllers/addressController');

const router = express.Router();

router.get('/all', deliveryAddressController.getAllDeliveryAddresses);

module.exports = router;