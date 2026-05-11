const Booking = require('../models/Booking');
const paymentService = require('../services/paymentService');

exports.getCheckout = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('service');
        if (!booking) return res.redirect('/discover');
        res.render('checkout', { booking });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.stkPush = async (req, res) => {
    try {
        const { bookingId, phone } = req.body;
        const booking = await Booking.findById(bookingId);
        if (!booking) return res.redirect('/discover');

        const result = await paymentService.initiateMpesaStkPush(booking, phone);

        if (result.success) {
            // For demo flow, simulate callback immediately
            await paymentService.handleSuccessfulPayment(result.transactionId, { MpesaReceiptNumber: 'STK' + Date.now() });

            req.flash('success_msg', 'Payment successful. Booking confirmed.');
            res.redirect('/bookings/my-bookings');
        } else {
            throw new Error('STK Push Initiation Failed');
        }
    } catch (err) {
        console.error('Payment Error:', err);
        req.flash('error_msg', 'Payment failed. Please try again.');
        res.redirect('back');
    }
};
