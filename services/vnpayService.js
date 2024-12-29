const Order  = require('../models/order');
const OrderDetail  = require('../models/orderDetail');
const crypto = require('crypto');
const querystring = require('querystring');

const VNPAY_URL = process.env.VNPAY_URL;
const VNPAY_TMN_CODE = process.env.VNPAY_TMN_CODE;
const VNPAY_HASH_SECRET = process.env.VNPAY_HASH_SECRET;

// Hàm tạo chữ ký cho VNPAY
const createSignature = (data) => {
    const sortedKeys = Object.keys(data).sort();
    const signData = sortedKeys.map(key => `${key}=${data[key]}`).join('&');
    const hmac = crypto.createHmac('sha256', VNPAY_HASH_SECRET);
    return hmac.update(signData).digest('hex');
};

exports.processPayment = async (paymentData) => {
    const { paymentMethods, orderDetails, total } = paymentData;

    // Kiểm tra dữ liệu đầu vào
    if (!paymentMethods || !orderDetails || !total) {
        throw new Error('Missing required fields');
    }

    // Tạo tham số cho yêu cầu thanh toán
    const vnpParams = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_Tmn_Code: VNPAY_TMN_CODE,
        vnp_Amount: total * 100, // Số tiền cần thanh toán (đơn vị: đồng)
        vnp_Curr_Code: 'VND',
        vnp_Bank_Code: paymentMethods, // Phương thức thanh toán
        vnp_Create_Date: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        vnp_OrderInfo: JSON.stringify(orderDetails),
        vnp_Locale: 'vn',
        vnp_ReturnUrl: 'http://localhost:3000/payment-result', // URL trả về sau khi thanh toán
        vnp_OrderId: Date.now().toString(), // ID đơn hàng
    };

    // Tạo chữ ký
    vnpParams.vnp_SecureHash = createSignature(vnpParams);

    // Gửi yêu cầu đến VNPAY
    const vnpUrl = `${VNPAY_URL}?${new URLSearchParams(vnpParams).toString()}`;

    return vnpUrl; // Trả về URL thanh toán
};

exports.handlePaymentResult = (paymentResult) => {
    const { vnp_ResponseCode, vnp_TxnRef, vnp_Amount, vnp_BankCode, vnp_CardType, vnp_OrderInfo, vnp_PayDate, vnp_TransactionNo, vnp_SecureHash } = paymentResult;

    const signData = `vnp_Amount=${vnp_Amount}&vnp_BankCode=${vnp_BankCode}&vnp_CardType=${vnp_CardType}&vnp_OrderInfo=${vnp_OrderInfo}&vnp_PayDate=${vnp_PayDate}&vnp_ResponseCode=${vnp_ResponseCode}&vnp_TxnRef=${vnp_TxnRef}&vnp_TransactionNo=${vnp_TransactionNo}`;
    const expectedHash = createSignature(signData);
    if (vnp_SecureHash !== expectedHash) {
        throw new Error('Invalid signature');
    }

    if (vnp_ResponseCode === '00') {
        // Thanh toán thành công
        // Thực hiện các logic cần thiết, ví dụ như cập nhật trạng thái đơn hàng
    } else {
        // Thanh toán thất bại
        // Thực hiện các logic cần thiết, ví dụ như hiển thị thông báo lỗi
    }
};