const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Shop = require('../models/Shop');
const User = require('../models/User');

exports.getBookingPage = async (req, res) => {
    try {
        const { shopId, serviceId } = req.query;
        const shop = await Shop.findById(shopId);
        const service = await Service.findById(serviceId);
        const barbers = await User.find({ role: 'barber' });
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
        const depositAmount = service.price * 0.2;

        const booking = new Booking({
            client: clientId,
            barber: barberId,
            service: serviceId,
            shop: shopId,
            date: new Date(date),
            time,
            depositAmount
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
