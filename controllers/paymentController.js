const axios = require('axios');
const Booking = require('../models/Booking');
const User = require('../models/User');
require('dotenv').config();

const getAccessToken = async () => {
    const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');
    try {
        const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
            headers: { Authorization: `Basic ${auth}` }
        });
        return response.data.access_token;
    } catch (err) {
        console.error('M-Pesa Token Error:', err.response ? err.response.data : err.message);
        throw err;
    }
};

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

        const accessToken = await getAccessToken();
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
        const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString('base64');

        let formattedPhone = phone.replace('+', '');
        if (formattedPhone.startsWith('0')) formattedPhone = '254' + formattedPhone.slice(1);

        const response = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
            BusinessShortCode: process.env.MPESA_SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: booking.depositAmount,
            PartyA: formattedPhone,
            PartyB: process.env.MPESA_SHORTCODE,
            PhoneNumber: formattedPhone,
            CallBackURL: `https://barberconnect.com/payments/callback`,
            AccountReference: 'BarberConnect',
            TransactionDesc: 'Booking Deposit'
        }, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (response.data.ResponseCode === "0") {
            // In a real production app, we would wait for the callback.
            // But since we are in a sandbox without a public URL, we'll assume success for the demo flow after initiating.
            booking.paymentStatus = 'paid';
            booking.status = 'confirmed';
            await booking.save();

            // Award loyalty points
            const user = await User.findById(booking.client);
            user.loyaltyPoints += Math.floor(booking.depositAmount / 100);
            await user.save();

            req.flash('success_msg', 'M-Pesa payment initiated successfully.');
            res.redirect('/bookings/my-bookings');
        } else {
            throw new Error('STK Push Failed');
        }
    } catch (err) {
        console.error('M-Pesa Error:', err.response ? err.response.data : err.message);
        req.flash('error_msg', 'Payment failed. Please try again.');
        res.redirect('back');
    }
};

exports.callback = async (req, res) => {
    // This is where M-Pesa sends the transaction result
    const result = req.body.Body.stkCallback;
    if (result.ResultCode === 0) {
        // Payment successful, update booking status in production
    }
    res.json({ ResultCode: 0, ResultDesc: "Success" });
};
