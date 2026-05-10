const Product = require('../models/Product');
const Notification = require('../models/Notification');

exports.getMarketplace = async (req, res) => {
    try {
        const products = await Product.find().populate('supplier');
        res.render('marketplace', { products });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.placeOrder = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await Product.findById(productId);

        if (!product || product.stock <= 0) {
            req.flash('error_msg', 'Product out of stock');
            return res.redirect('back');
        }

        product.stock -= 1;
        await product.save();

        // Notify user
        const notification = new Notification({
            user: req.session.user.id,
            title: 'Order Placed',
            message: `Your order for ${product.name} has been placed and is being processed.`
        });
        await notification.save();

        req.flash('success_msg', 'Order placed successfully!');
        res.redirect('/client/marketplace');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
