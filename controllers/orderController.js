const sequelize = require("../config/database");
const Order = require("../models/order");
const OrderDetail = require("../models/orderDetail");
const { formatResponse } = require("../utils/responseFormatter");
const { v4: uuidv4 } = require("uuid"); // Thư viện tạo ID duy nhất cho đơn hàng
const crypto = require("crypto-js");
const axios = require("axios");
const Product = require("../models/product");
const Image = require("../models/image");



exports.getAllOrders = async (req, res) => {
  try {
    // Lấy user_id từ request (ví dụ: qua xác thực token)
    const userId = req.user.id;

    // Truy vấn danh sách đơn hàng của người dùng
    const orders = await Order.findAll({
      where: { user_id: userId }, // Lọc theo user
      attributes: ['id', 'created_at', 'orderStatus', 'total',], // Chỉ lấy các trường cần thiết
      include: [
        {
          model: Product,
          as: 'products',
          attributes: ['id', 'prod_name'], // Chỉ lấy thông tin cơ bản của sản phẩm
          through: { attributes: ['quantity', 'price'] }, // Lấy thông tin từ bảng trung gian
          include: [
            {
              model: Image,
              as: 'images',
              attributes: ['url'], // Lấy ảnh sản phẩm
            },
          ],
        },
      ],
    });

    // Chuẩn hóa dữ liệu trả về
    const result = orders.map(order => ({
      orderId: order.id,
      createdAt: order.created_at,
      status: order.orderStatus,
      total: order.total,
      products: order.products.map(product => ({
        id: product.id,
        name: product.prod_name,
        images: product.images.map(image => image.url), // Trả về danh sách URL ảnh
      })),
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Có lỗi xảy ra khi lấy danh sách đơn hàng.' });
  }
};

exports.detailsOrderByID = async (req, res) => {
  try {
    const { id } = req.params;  // Sử dụng 'id' thay vì 'order_id'

    // Kiểm tra nếu không có id
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Missing or invalid order_id",
      });
    }

    console.log("Order ID received:", id);  // Log giá trị id

    // Truy vấn đơn hàng
    const orderDetails = await Order.findOne({
      where: { id: id },  // Tìm đơn hàng theo 'id'
      include: [
        {
          model: Product,
          as: "products",
          through: { attributes: ["quantity", "price"] },
          include: [{ model: Image, as: "images", attributes: ["url"] }],
        },
      ],
    });

    // Nếu không tìm thấy đơn hàng
    if (!orderDetails) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: orderDetails,
    });
  } catch (error) {
    console.error("Error fetching order details:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// add order
exports.addOrder = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  const user_id = req.user.id;
  console.log(req.body);

  try {
    const { paymentMethods, name, phone, address, note, orderDetails, is_payment, created_at } = req.body;
    const isPayment = paymentMethods === "COD";

    let total = 0;

    // Kiểm tra tồn tại sản phẩm và tính tổng giá trị đơn hàng
    for (const detail of orderDetails) {
      const product = await Product.findByPk(detail.product_id);
      if (!product) {
        await transaction.rollback();
        return res.status(400).json(formatResponse(`Product with ID ${detail.product_id} not found`, null, false));
      }

      if (detail.quantity > product.quantity) {
        await transaction.rollback();
        return res.status(400).json(formatResponse(`Not enough quantity for product ID ${detail.product_id}`, null, false));
      }

      total += product.price * detail.quantity;
    }

    // Tạo đơn hàng
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
        is_payment,
        created_at
      },
      { transaction }
    );

    const orderDetailsWithImages = []; // Mảng để lưu chi tiết đơn hàng với hình ảnh

    // Tạo OrderDetail và cập nhật số lượng sản phẩm
    for (const detail of orderDetails) {
      const product = await Product.findByPk(detail.product_id, {
        include: [{ model: Image, as: "images", attributes: ["url"] }],
      });

      const orderDetail = await OrderDetail.create(
        {
          order_id: order.id,
          product_id: detail.product_id,
          quantity: detail.quantity,
          price: product.price,
        },
        { transaction }
      );

      // Cập nhật số lượng sản phẩm
      await product.update(
        { quantity: product.quantity - detail.quantity },
        { transaction }
      );

      // Thêm thông tin hình ảnh vào chi tiết đơn hàng
      orderDetailsWithImages.push({
        order_id: orderDetail.order_id,
        product_id: detail.product_id,
        quantity: detail.quantity,
        price: product.price,
        images: product.images.map(image => image.url), // Lấy URL hình ảnh
      });
    }

    await transaction.commit();

    // Lấy chi tiết đơn hàng đã lưu
    res.status(201).json(formatResponse("Order added successfully", {
      order,
      orderDetails: orderDetailsWithImages // Thêm orderDetails với hình ảnh vào phản hồi
    }));
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

// huỷ đơn
exports.cancelOrder = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  const { id } = req.params; // Nhận id của đơn hàng từ tham số URL

  try {
    // Kiểm tra xem đơn hàng có tồn tại không
    const order = await Order.findOne({
      where: { id: id },
      include: [
        {
          model: Product,
          as: "products",
          through: { attributes: ["quantity", "price"] },
        },
      ],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Kiểm tra trạng thái đơn hàng và quyết định có thể huỷ không
    if (order.orderStatus === 'completed' || order.orderStatus === 'shipping' || order.orderStatus === 'resolved') {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled because it is already completed, shipped, or resolved",
      });
    }

    // Kiểm tra nếu đơn hàng đã huỷ
    if (order.orderStatus === 'canceled') {
      return res.status(400).json({
        success: false,
        message: "Order has already been cancelled",
      });
    }

    // Cập nhật lại số lượng sản phẩm trong kho
    for (const detail of order.products) {
      const product = await Product.findByPk(detail.id);
      await product.update({ quantity: product.quantity + detail.OrderDetail.quantity }, { transaction });
    }

    // Cập nhật trạng thái đơn hàng thành "canceled"
    await order.update({ orderStatus: 'canceled' }, { transaction });

    // Commit transaction
    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: "Order has been cancelled successfully",
    });
  } catch (error) {
    // Rollback transaction nếu có lỗi
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
