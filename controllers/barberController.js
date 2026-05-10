const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Shop = require('../models/Shop');
const Shift = require('../models/Shift');
const User = require('../models/User');
const { createNotification } = require('./notificationController');
const { updatePerformance } = require('../utils/timeEstimator');

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

        // If completed, award final loyalty points and update performance
        if (status === 'completed') {
            booking.actualEndTime = new Date();
            await booking.save();

            const client = await User.findById(booking.client._id);
            client.loyaltyPoints += 50;
            await client.save();

            const barber = await User.findById(req.session.user.id);
            await updatePerformance(barber, booking);
        }

        if (status === 'in-progress') {
            booking.actualStartTime = new Date();
            await booking.save();
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

exports.getStaffManagement = async (req, res) => {
    try {
        const shop = await Shop.findOne({ owner: req.session.user.id }).populate('staff');
        if (!shop) return res.redirect('/barber/dashboard');
        const shifts = await Shift.find({ shop: shop._id }).populate('barber').sort({ date: 1 });
        res.render('manage-staff', { shop, shifts });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.assignShift = async (req, res) => {
    try {
        const { barberId, date, startTime, endTime, shopId } = req.body;
        const shift = new Shift({ barber: barberId, date, startTime, endTime, shop: shopId });
        await shift.save();
        req.flash('success_msg', 'Shift assigned successfully');
        res.redirect('/barber/manage-staff');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { bufferTime, isPaused, isBusy } = req.body;
        await User.findByIdAndUpdate(req.session.user.id, {
            bufferTime,
            isPaused: isPaused === 'on',
            isBusy: isBusy === 'on'
        });
        req.flash('success_msg', 'Profile updated successfully');
        res.redirect('/barber/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.addService = async (req, res) => {
    try {
        const { name, description, duration, price, shopId, category } = req.body;
        const serviceData = {
            name,
            description,
            duration,
            price,
            shop: shopId,
            category
        };
        if (req.file) serviceData.image = `/uploads/${req.file.filename}`;

        const service = new Service(serviceData);
        await service.save();
        req.flash('success_msg', 'Service added successfully');
        res.redirect('/barber/manage-services');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
