
const Coupons = require("../models/coupons")
const { Op } = require('sequelize');
exports.getAllCoupons = async (req, res,next) => {
  try {
    const discounts = await Coupons.findAll();
    res.status(200).json(discounts);
  } catch (error) {
    next(error);
  }
};

exports.getAllActiveCoupons = async (req, res) => {
  try {
    const coupons = await Coupons.findAll({
      where: {
        start_date: {
          [Op.lte]: new Date(), // Ngày bắt đầu trước hoặc bằng hôm nay
        },
        end_date: {
          [Op.gte]: new Date(), // Ngày kết thúc sau hoặc bằng hôm nay
        },
      },
    });
    res.json(coupons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

