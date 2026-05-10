const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String },
    address: { type: String, required: true },
    location: {
        type: { type: String, default: 'Point' },
        coordinates: [Number]
    },
    gallery: [String],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isPremium: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isTopRated: { type: Boolean, default: false },
    professionalismScore: { type: Number, default: 0 },
    responseSpeed: { type: Number, default: 0 }, // in minutes
    staff: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    seats: { type: Number, default: 2 },
    country: { type: String, default: 'Kenya' },
    currency: { type: String, default: 'KES' }
}, { timestamps: true });

shopSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Shop', shopSchema);
