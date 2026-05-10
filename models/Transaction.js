const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
    amount: { type: Number, required: true },
    commission: { type: Number, default: 0 },
    netAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    type: {
        type: String,
        enum: ['deposit', 'full_payment', 'payout', 'refund'],
        default: 'deposit'
    },
    paymentGateway: { type: String, default: 'M-Pesa' },
    receiptNumber: { type: String },
    gatewayResponse: { type: Object },
    currency: { type: String, default: 'KES' }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
