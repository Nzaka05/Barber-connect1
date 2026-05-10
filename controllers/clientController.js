const Shop = require('../models/Shop');
const Service = require('../models/Service');
const User = require('../models/User');

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

        const shops = await Shop.find(query).limit(20);
        res.render('discover', { shops, lat, lng });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.getShopProfile = async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id).populate('owner');
        if (!shop) return res.status(404).render('error', { message: 'Shop not found', status: 404 });
        const services = await Service.find({ shop: shop._id });
        res.render('shop-profile', { shop, services });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
