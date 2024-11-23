
 const Coupons = require("../models/coupons")
exports.getAllCoupons = async (req, res,next) => {
  try {
    const discounts = await Coupons.findAll();
    res.status(200).json(discounts);
  } catch (error) {
    next(error);
  }
};

 