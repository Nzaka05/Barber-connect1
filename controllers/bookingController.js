const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Shop = require('../models/Shop');
const User = require('../models/User');
const { predictDuration } = require('../utils/timeEstimator');

exports.getBookingPage = async (req, res) => {
    try {
        const { shopId, serviceId } = req.query;
        const shop = await Shop.findById(shopId).populate('staff');
        const service = await Service.findById(serviceId);

        // Intelligent Slot Suggestion Logic
        // Find most available barber for the day
        const today = new Date();
        today.setHours(0,0,0,0);

        const barbers = await Promise.all(shop.staff.map(async (barber) => {
            const bookingCount = await Booking.countDocuments({
                barber: barber._id,
                date: { $gte: today, $lt: new Date(today.getTime() + 86400000) },
                status: { $ne: 'cancelled' }
            });
            return {
                ...barber.toObject(),
                workload: bookingCount
            };
        }));

        // Sort by workload (ascending) and then by rating (descending)
        barbers.sort((a, b) => a.workload - b.workload || b.rating - a.rating);

        res.render('create-booking', { shop, service, barbers });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.createBooking = async (req, res) => {
    try {
        const { shopId, serviceId, barberId, date, time } = req.body;
        const clientId = req.session.user.id;

        const existingBooking = await Booking.findOne({
            barber: barberId,
            date: new Date(date),
            time: time,
            status: { $ne: 'cancelled' }
        });

        if (existingBooking) {
            req.flash('error_msg', 'This time slot is already booked.');
            return res.redirect('back');
        }

        const service = await Service.findById(serviceId);
        const barber = await User.findById(barberId);
        const depositAmount = service.price * 0.2;

        const booking = new Booking({
            client: clientId,
            barber: barberId,
            service: serviceId,
            shop: shopId,
            date: new Date(date),
            time,
            depositAmount,
            estimatedDuration: predictDuration(service, barber)
        });

        await booking.save();
        res.redirect(`/payments/checkout/${booking._id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ client: req.session.user.id })
            .populate('shop')
            .populate('service')
            .populate('barber')
            .sort({ date: -1 });
        res.render('my-bookings', { bookings });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
