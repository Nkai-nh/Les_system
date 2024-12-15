const DeliveryAddress = require('../models/deliveryAddress');
const { formatResponse } = require('../utils/responseFormatter');
const { v4: uuidv4 } = require('uuid'); 

exports.getAllDeliveryAddresses = async (req, res, next) => {
    try {
        const userId = req.params.user_id; // Lấy user_id từ params

        // Kiểm tra xem userId có được cung cấp không
        if (!userId) {
            return res.status(400).json(formatResponse('User ID is required', null));
        }

        // Tìm tất cả địa chỉ giao hàng của người dùng
        const deliveryAddresses = await DeliveryAddress.findAll({
            where: { user_id: userId } // Lọc theo user_id
        });

        // Kiểm tra xem có địa chỉ nào không
        if (deliveryAddresses.length === 0) {
            return res.status(404).json(formatResponse('No delivery addresses found for this user', null));
        }

        res.status(200).json(formatResponse('Delivery addresses retrieved successfully', deliveryAddresses));
    } catch (error) {
        next(error);
    }
};

// Thêm địa chỉ giao hàng mới
exports.addDeliveryAddress = async (req, res, next) => {
    try {
        const { user_id, detail_address, province, district, ward } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!user_id || !detail_address) {
            return res.status(400).json(formatResponse('User ID and detail address are required', null));
        }

        // Tìm tất cả địa chỉ giao hàng của người dùng
        const deliveryAddresses = await DeliveryAddress.findAll({
            where: { user_id }
        });

        // Kiểm tra số lượng địa chỉ giao hàng hiện có
        if (deliveryAddresses.length >= 2) {
            return res.status(400).json(formatResponse('A user can only have up to 3 delivery addresses', null));
        }

        // Tạo địa chỉ giao hàng mới
        const newDeliveryAddress = await DeliveryAddress.create({
            id: uuidv4(),
            user_id,
            detail_address,
            province,
            district,
            ward
        });

        res.status(201).json(formatResponse('Delivery address added successfully', newDeliveryAddress));
    } catch (error) {
        next(error);
    }
};

// Cập nhật địa chỉ giao hàng
exports.updateDeliveryAddress = async (req, res, next) => {
    try {
        const { address_id, user_id } = req.params;
        const { detail_address, province, district, ward } = req.body;

        // Kiểm tra xem address_id, user_id, và các thông tin cập nhật có được cung cấp không
        if (!address_id || !user_id || !detail_address || !province || !district || !ward) {
            return res.status(400).json(formatResponse('All fields (detail_address, province, district, ward) are required', null));
        }

        // Tìm địa chỉ giao hàng cần cập nhật
        const deliveryAddress = await DeliveryAddress.findOne({
            where: { id: address_id, user_id }
        });

        // Kiểm tra xem địa chỉ giao hàng có tồn tại không
        if (!deliveryAddress) {
            return res.status(404).json(formatResponse('Delivery address not found', null));
        }

        // Cập nhật các thông tin địa chỉ
        deliveryAddress.detail_address = detail_address;
        deliveryAddress.province = province;
        deliveryAddress.district = district;
        deliveryAddress.ward = ward;

        // Lưu địa chỉ đã cập nhật vào cơ sở dữ liệu
        await deliveryAddress.save();

        res.status(200).json(formatResponse('Delivery address updated successfully', deliveryAddress));
    } catch (error) {
        next(error);
    }
};

exports.deleteDeliveryAddress = async (req, res, next) => {
    try {
        const { address_id, user_id } = req.params;

        // Kiểm tra xem address_id và user_id có được cung cấp không
        if (!address_id || !user_id) {
            return res.status(400).json(formatResponse('Address ID and User ID are required', null));
        }

        // Tìm địa chỉ giao hàng cần xóa
        const deliveryAddress = await DeliveryAddress.findOne({
            where: { id: address_id, user_id }
        });

        // Kiểm tra xem địa chỉ giao hàng có tồn tại không
        if (!deliveryAddress) {
            return res.status(404).json(formatResponse('Delivery address not found', null));
        }

        // Kiểm tra nếu số lượng địa chỉ giao hàng còn lại sẽ dưới 1 sau khi xóa
        const remainingAddressesCount = await DeliveryAddress.count({
            where: { user_id }
        });

        // Nếu chỉ còn một địa chỉ, không cho phép xóa
        if (remainingAddressesCount <= 1) {
            return res.status(400).json(formatResponse('User must have at least one delivery address', null));
        }

        // Xóa địa chỉ giao hàng
        await deliveryAddress.destroy();

        res.status(200).json(formatResponse('Delivery address deleted successfully', null));
    } catch (error) {
        next(error);
    }
};
