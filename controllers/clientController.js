const Shop = require('../models/Shop');
const Service = require('../models/Service');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Waitlist = require('../models/Waitlist');
const Review = require('../models/Review');

exports.getDiscover = async (req, res) => {
    try {
        const { lat, lng } = req.query;
        let query = {};

        if (lat && lng) {
            query.location = {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: 10000 // 10km
                }
            };
        }

        const shops = await Shop.find(query)
            .sort({ isPremium: -1, isTopRated: -1, rating: -1 })
            .limit(20);

        let mobileBarbers = [];
        if (lat && lng) {
            mobileBarbers = await User.find({
                role: 'barber',
                isMobile: true,
                location: {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [parseFloat(lng), parseFloat(lat)]
                        },
                        $maxDistance: 15000 // 15km
                    }
                }
            }).limit(10);
        }

        res.render('discover', { shops, mobileBarbers, lat, lng });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.getShopProfile = async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id).populate('owner staff');
        if (!shop) return res.status(404).render('error', { message: 'Shop not found', status: 404 });

        const services = await Service.find({ shop: shop._id });

        // Queue calculation
        const today = new Date();
        today.setHours(0,0,0,0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const activeBookings = await Booking.find({
            shop: shop._id,
            date: { $gte: today, $lt: tomorrow },
            status: 'confirmed'
        });

        const queueSize = activeBookings.length;
        const avgServiceTime = 30; // mins
        const staffCount = shop.staff.length || 1;
        const estimatedWaitTime = Math.max(0, Math.ceil((queueSize * avgServiceTime) / staffCount));

        res.render('shop-profile', {
            shop,
            services,
            queue: {
                size: queueSize,
                waitTime: estimatedWaitTime,
                isFull: queueSize >= (staffCount * 5)
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.addReview = async (req, res) => {
    try {
        const { shopId, rating, comment } = req.body;
        const review = new Review({
            client: req.session.user.id,
            shop: shopId,
            rating,
            comment
        });
        await review.save();

        // Update shop rating
        const shop = await Shop.findById(shopId);
        const reviews = await Review.find({ shop: shopId });
        const avgRating = reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length;
        shop.rating = avgRating.toFixed(1);
        shop.numReviews = reviews.length;
        await shop.save();

        req.flash('success_msg', 'Thank you for your review!');
        res.redirect(`/shop/${shopId}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.followBarber = async (req, res) => {
    try {
        const barber = await User.findById(req.params.id);
        if (!barber.followers.includes(req.session.user.id)) {
            barber.followers.push(req.session.user.id);
            await barber.save();
        }
        req.flash('success_msg', `You are now following ${barber.name}`);
        res.redirect('back');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.joinWaitlist = async (req, res) => {
    try {
        const { shopId, serviceId } = req.body;
        const entry = new Waitlist({
            client: req.session.user.id,
            shop: shopId,
            service: serviceId
        });
        await entry.save();
        req.flash('success_msg', 'You have been added to the waitlist. We will notify you when a slot opens up.');
        res.redirect(`/shop/${shopId}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
