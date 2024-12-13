const express = require('express');
const deliveryAddressController = require('../controllers/addressController');

const router = express.Router();

router.get('/all/:user_id', deliveryAddressController.getAllDeliveryAddresses);
router.post('/add-delivery', deliveryAddressController.addDeliveryAddress);
router.delete('/:user_id/delete/:address_id', deliveryAddressController.deleteDeliveryAddress);
router.put('/:user_id/update/:address_id', deliveryAddressController.updateDeliveryAddress);


module.exports = router;