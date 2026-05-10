const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    name: { type: String, required: true },
    description: { type: String },
    duration: { type: Number }, // in minutes, optional (overrides default)
    price: { type: Number, required: true },
    image: { type: String },
    category: { type: String, enum: ['Haircut', 'Beard', 'Facial', 'Massage', 'Other'], default: 'Haircut' }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
