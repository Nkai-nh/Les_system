
const Coupons = require("../models/coupons")
const { Op } = require('sequelize');
const moment = require('moment');
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
    const todayStart = moment().startOf('day').toDate(); // Lấy thời điểm bắt đầu hôm nay
    const todayEnd = moment().endOf('day').toDate(); // Lấy thời điểm kết thúc hôm nay

    const coupons = await Coupons.findAll({
      where: {
        start_date: {
          [Op.lte]: todayEnd, // Ngày bắt đầu trước hoặc bằng cuối hôm nay
        },
        end_date: {
          [Op.gte]: todayStart, // Ngày kết thúc sau hoặc bằng bắt đầu hôm nay
        },
      },
    });
    res.json(coupons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

