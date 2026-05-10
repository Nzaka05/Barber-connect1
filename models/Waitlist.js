const mongoose = require('mongoose');

const waitlistSchema = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    status: { type: String, enum: ['waiting', 'notified', 'converted', 'cancelled'], default: 'waiting' }
}, { timestamps: true });

module.exports = mongoose.model('Waitlist', waitlistSchema);
