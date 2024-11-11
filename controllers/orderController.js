const sequelize = require("../config/database");
const Order = require("../models/order");
const OrderDetail = require("../models/orderDetail");
const { formatResponse } = require("../utils/responseFormatter");
const { v4: uuidv4 } = require("uuid"); // Thư viện tạo ID duy nhất cho đơn hàng
const crypto = require("crypto-js");
const axios = require("axios");
const Product = require("../models/product");

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll();
    res
      .status(200)
      .json(formatResponse("Orders retrieved successfully", orders));
  } catch (error) {
    next(error);
  }
};

// add order
exports.addOrder = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  const user_id = req.user.id;
  console.log(req.body);
  try {
    const { paymentMethods, name, phone, address, note, total,orderDetails } = req.body;

    // check paymentMethods is cod or online
    let isPayment = false;
    if (paymentMethods === "COD") {
      isPayment = true;
    }

    // Tạo đơn hàng mới
    const order = await Order.create(
      {
        id: uuidv4(),
        user_id,
        paymentMethods,
        name,
        phone,
        total,
        address,
        note,
        isPayment,
      },
      { transaction }
    );

    // Kiểm tra và thêm chi tiết đơn hàng
    for (const detail of orderDetails) {
      const product = await Product.findByPk(detail.product_id);
      if (!product) {
        await transaction.rollback();
        return res
          .status(400)
          .json(formatResponse(`Product with id ${detail.product_id} not found`, null, false));
      }

      await OrderDetail.create(
        {
          order_id: order.id,
          product_id: detail.product_id,
          quantity: detail.quantity,
          price: product.price,
        },
        { transaction }
      );
    }

    await transaction.commit();
    res.status(201).json(formatResponse("Order added successfully", order));
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};
exports.paymentWithMomo = async (req, res, next) => {
  const { orderId ,total} = req.body;
  var partnerCode = "MOMOBKUN20180529";
  var accessKey = "klm05TvNBzhg7h7j";
  var secretkey = "at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa";
  var requestId = partnerCode + new Date().getTime();
  var orderInfo = "pay with MoMo";
  var redirectUrl = "http://localhost:3000/api/checkout/callback";
  var ipnUrl = "https://d9cd-116-110-113-2.ngrok-free.app/api/orders/callback-with-momo";
  var amount = total.toString();
  var requestType = "payWithMethod";
  var extraData = "";
  console.log("Request to MoMo: ", req.body);

  var rawSignature =
    "accessKey=" +
    accessKey +
    "&amount=" +
    amount +
    "&extraData=" +
    extraData +
    "&ipnUrl=" +
    ipnUrl +
    "&orderId=" +
    orderId +
    "&orderInfo=" +
    orderInfo +
    "&partnerCode=" +
    partnerCode +
    "&redirectUrl=" +
    redirectUrl +
    "&requestId=" +
    requestId +
    "&requestType=" +
    requestType;

  const signature = crypto
    .HmacSHA256(rawSignature, secretkey)
    .toString(crypto.enc.Hex);

  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    accessKey: accessKey,
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    extraData: extraData,
    requestType: requestType,
    signature: signature,
    lang: "en",
  });
  // options for axios
  const options = {
    method: "POST",
    url: "https://test-payment.momo.vn/v2/gateway/api/create",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(requestBody),
    },
    data: requestBody,
  };
  console.log("Request to MoMo: ", options);
  // Send the request and handle the response
  let result;
  try {
    result = await axios(options);
    if (result.data.resultCode !== 0) {
      res.status(400).json(formatResponse(result.data.message, result.data));
    }
    res
      .status(200)
      .json(formatResponse("Orders retrieved successfully", result.data));
  } catch (error) {
    next(error);
  }
};

exports.callbackMomo = async (req, res, next) => {
  try {
    console.log("Callback from MoMo: ", req.body);
    const { orderId, resultCode } = req.body;
    if (resultCode === 0) {
      const order = await Order.findOne({ where: { id: orderId } });

      if (order) {
        order.orderStatus = "pending";
        await order.save();
      }else{
        res.status(404).json(formatResponse("Order not found", null));
      }
    }
    res.status(200).json(formatResponse("Callback from MoMo", req.body));
  } catch (error) {
    next(error);
  }
};
