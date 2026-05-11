const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    name: { type: String, required: true },
    stock: { type: Number, default: 0 },
    price: { type: Number, required: true },
    category: { type: String },
    image: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
