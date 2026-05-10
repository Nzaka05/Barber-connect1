const User = require('../models/User');
const Shop = require('../models/Shop');
const Booking = require('../models/Booking');

exports.getDashboard = async (req, res) => {
    try {
        const usersCount = await User.countDocuments();
        const shopsCount = await Shop.countDocuments();
        const bookingsCount = await Booking.countDocuments();
        const recentBookings = await Booking.find().populate('client barber shop').sort({ createdAt: -1 }).limit(5);

        res.render('admin-dashboard', {
            stats: { usersCount, shopsCount, bookingsCount },
            recentBookings
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.render('admin-users', { users });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
