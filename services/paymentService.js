const axios = require('axios');
const Transaction = require('../models/Transaction');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Shop = require('../models/Shop');

const PLATFORM_COMMISSION_RATE = 0.1; // 10%

exports.calculateCommission = (amount) => {
    return Math.round(amount * PLATFORM_COMMISSION_RATE);
};

exports.initiateMpesaStkPush = async (booking, phone) => {
    // Modular M-Pesa STK Push implementation
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

    // 2. Mocking STK Push API call
    // In production, use the actual axios call developed previously
    return { success: true, transactionId: transaction._id };
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

    // Update shop/user earnings (future wallet system)
    const shop = await Shop.findById(transaction.shop);
    if (shop) {
        shop.totalEarnings += transaction.netAmount;
        shop.walletBalance += transaction.netAmount;
        await shop.save();
    }

    return transaction;
};
