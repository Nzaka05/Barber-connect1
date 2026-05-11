const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    barber: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'partial', 'paid'],
        default: 'unpaid'
    },
    depositAmount: { type: Number, default: 0 },
    mpesaReceiptNumber: { type: String },
    actualStartTime: { type: Date },
    actualEndTime: { type: Date },
    estimatedDuration: { type: Number } // Final duration used for this specific booking
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
