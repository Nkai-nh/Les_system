const DeliveryAddress = require('../models/deliveryAddress');
const { formatResponse } = require('../utils/responseFormatter');

exports.getAllDeliveryAddresses = async (req, res, next) => {
    try {
        const deliveryAddresses = await DeliveryAddress.findAll();
        res.status(200).json(formatResponse('Delivery addresses retrieved successfully', deliveryAddresses));
    } catch (error) {
        next(error);
    }
};