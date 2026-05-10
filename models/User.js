const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['client', 'barber', 'shop_owner', 'admin'],
        default: 'client'
    },
    profileImage: { type: String, default: '/images/default-profile.png' },
    loyaltyPoints: { type: Number, default: 0 },
    location: {
        type: { type: String, default: 'Point' },
        coordinates: [Number] // [longitude, latitude]
    },
    isMobile: { type: Boolean, default: false },
    travelRadius: { type: Number, default: 5 }, // in km
    mobileServiceFee: { type: Number, default: 0 },
    country: { type: String, default: 'Kenya' },
    currency: { type: String, default: 'KES' },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    bufferTime: { type: Number, default: 5 }, // in minutes
    isPaused: { type: Boolean, default: false },
    isBusy: { type: Boolean, default: false },
    performanceMetrics: {
        avgSpeedFactor: { type: Number, default: 1.0 }, // 1.0 = average, 0.8 = fast, 1.2 = slow
        completedBookings: { type: Number, default: 0 }
    },
    walletBalance: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', userSchema);
