const mongoose = require('mongoose');
const User = require('./models/User');
const Shop = require('./models/Shop');
const Service = require('./models/Service');
require('dotenv').config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        await User.deleteMany({});
        await Shop.deleteMany({});
        await Service.deleteMany({});

        const admin = new User({
            name: 'Admin User',
            email: 'admin@example.com',
            phone: '0700000000',
            password: 'password123',
            role: 'admin'
        });
        await admin.save();

        const barber1 = new User({
            name: 'John Barber',
            email: 'barber1@example.com',
            phone: '0711111111',
            password: 'password123',
            role: 'barber'
        });
        await barber1.save();

        const shop1 = new Shop({
            owner: barber1._id,
            name: 'The Grooming Lounge',
            description: 'Premium grooming for the modern man.',
            address: 'Kilimani, Nairobi',
            location: { type: 'Point', coordinates: [36.7846, -1.2921] },
            rating: 4.9
        });
        await shop1.save();

        const service1 = new Service({
            shop: shop1._id,
            name: 'Luxury Haircut',
            description: 'Full service haircut with hot towel treatment.',
            duration: 45,
            price: 1500
        });
        await service1.save();

        console.log('Data seeded successfully');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
