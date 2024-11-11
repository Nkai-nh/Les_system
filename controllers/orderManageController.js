const Order = require("../models/order");
const OrderDetail = require("../models/orderDetail");
const Product = require("../models/product");
const Image = require("../models/image");
const { formatResponse } = require("../utils/responseFormatter");

exports.getOrders = async (req, res) => {
  const orders = await Order.findAll({
    include: [
      {
        model: Product,
        as: "products",
        through: {
          model: OrderDetail,
          attributes: ["quantity", "price"],
        },
        include: [
          {
            model: Image,
            as: "images",
          },
        ],
      },
    ],
  });

  res.status(200).json(formatResponse("Orders retrieved successfully", orders));
};

// confirm order
exports.confirmOrder = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findOne({
    where: { id },
  });

  if (!order) {
    return res.status(404).json(formatResponse("Order not found", null));
  }

  await order.update({ orderStatus: "confirmed" });

  res.status(200).json(formatResponse("Order confirmed successfully", order));
};

// check order status
exports.checkOrderStatus = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findOne({
    where: { id },
    // laâấy orderStatus
    attributes: ["orderStatus"],
  });

  if (!order) {
    return res.status(404).json(formatResponse("Order not found", null));
  }

  res
    .status(200)
    .json(formatResponse("Order status checked successfully", order));
};

//  resolve complaints related to orders
exports.resolveComplaint = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findOne({
    where: { id },
  });

  if (!order) {
    return res.status(404).json(formatResponse("Order not found", null));
  }

  await order.update({ orderStatus: "resolved" });

  res
    .status(200)
    .json(formatResponse("Order complaint resolved successfully", order));
};

// vview report of orders
exports.viewReport = async (req, res) => {
  const orders = await Order.findAll({
    include: [
      {
        model: Product,
        as: "products",
        through: {
          model: OrderDetail,
          attributes: ["quantity", "price"],
        },
        include: [
          {
            model: Image,
            as: "images",
          },
        ],
      },
    ],
  });

  res
    .status(200)
    .json(formatResponse("Orders report retrieved successfully", orders));
};
