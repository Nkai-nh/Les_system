const vnpayService = require('../services/vnpayService');

exports.createPayment = async (req, res) => {
    try {
        const paymentUrl = await vnpayService.processPayment(req.body);
        res.status(200).json({ paymentUrl });
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};
exports.handlePaymentResult = (req, res) => {
    try {
        const paymentResult = req.query;
        paymentService.handlePaymentResult(paymentResult);
        res.redirect('/payment-result');
    } catch (error) {
        console.error('Error handling payment result:', error);
        res.status(400).json({ message: 'Invalid payment result' });
    }
};