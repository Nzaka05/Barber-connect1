const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Shop = require('../models/Shop');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

exports.getDashboard = async (req, res) => {
    try {
        const barberId = req.session.user.id;
        const bookings = await Booking.find({ barber: barberId })
            .populate('client')
            .populate('service')
            .sort({ date: 1, time: 1 });

        const shop = await Shop.findOne({ owner: barberId }) || await Shop.findOne();

        const stats = {
            totalBookings: bookings.length,
            confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
            pendingBookings: bookings.filter(b => b.status === 'pending').length,
            totalEarnings: bookings.filter(b => b.status === 'completed').reduce((acc, b) => acc + (b.service ? b.service.price : 0), 0)
        };

        res.render('barber-dashboard', { bookings, stats, shop });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.updateBookingStatus = async (req, res) => {
    try {
        const { bookingId, status } = req.body;
        const booking = await Booking.findByIdAndUpdate(bookingId, { status }).populate('client service');

        // Notify client
        await createNotification(
            booking.client._id,
            'Booking Update',
            `Your booking for ${booking.service.name} has been ${status}.`
        );

        // If completed, award final loyalty points (if not already awarded by deposit)
        if (status === 'completed') {
            const user = await User.findById(booking.client._id);
            user.loyaltyPoints += 50; // Bonus for completion
            await user.save();
        }

        req.flash('success_msg', `Booking ${status} successfully`);
        res.redirect('/barber/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.getManageServices = async (req, res) => {
    try {
        const barberId = req.session.user.id;
        const shop = await Shop.findOne({ owner: barberId });
        if (!shop) {
            req.flash('error_msg', 'Please create a shop profile first.');
            return res.redirect('/barber/dashboard');
        }
        const services = await Service.find({ shop: shop._id });
        res.render('manage-services', { services, shop });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.addService = async (req, res) => {
    try {
        const { name, description, duration, price, shopId } = req.body;
        const service = new Service({ name, description, duration, price, shop: shopId });
        await service.save();
        req.flash('success_msg', 'Service added successfully');
        res.redirect('/barber/manage-services');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
