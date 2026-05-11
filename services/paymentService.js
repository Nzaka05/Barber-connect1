const axios = require('axios');
const Transaction = require('../models/Transaction');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Shop = require('../models/Shop');
require('dotenv').config();

const PLATFORM_COMMISSION_RATE = 0.1; // 10%

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

exports.calculateCommission = (amount) => {
    return Math.round(amount * PLATFORM_COMMISSION_RATE);
};

exports.initiateMpesaStkPush = async (booking, phone) => {
    const amount = booking.depositAmount;
    const commission = this.calculateCommission(amount);
    const netAmount = amount - commission;

    // 1. Create a pending transaction
    const transaction = new Transaction({
        booking: booking._id,
        user: booking.client,
        shop: booking.shop,
        amount,
        commission,
        netAmount,
        type: 'deposit'
    });
    await transaction.save();

    // 2. Real STK Push API call
    try {
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
            Amount: amount,
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
            return { success: true, transactionId: transaction._id };
        } else {
            transaction.status = 'failed';
            await transaction.save();
            return { success: false, message: 'STK Push Rejected' };
        }
    } catch (err) {
        transaction.status = 'failed';
        await transaction.save();
        throw err;
    }
};

exports.handleSuccessfulPayment = async (transactionId, gatewayResponse) => {
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) throw new Error('Transaction not found');

    transaction.status = 'completed';
    transaction.gatewayResponse = gatewayResponse;
    transaction.receiptNumber = gatewayResponse.MpesaReceiptNumber || 'MOCK' + Date.now();
    await transaction.save();

    // Update booking status
    const booking = await Booking.findById(transaction.booking);
    booking.paymentStatus = 'paid';
    booking.status = 'confirmed';
    await booking.save();

    // Update shop/user earnings
    const shop = await Shop.findById(transaction.shop);
    if (shop) {
        shop.totalEarnings += transaction.netAmount;
        shop.walletBalance += transaction.netAmount;
        await shop.save();
    }

    return transaction;
};
