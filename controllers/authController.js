const User = require('../models/User');

exports.register = async (req, res) => {
    try {
        const { name, email, phone, password, role } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            req.flash('error_msg', 'Email already registered');
            return res.redirect('/auth/register');
        }
        user = new User({ name, email, phone, password, role });
        await user.save();
        req.flash('success_msg', 'You are now registered and can log in');
        res.redirect('/auth/login');
    } catch (err) {
        console.error(err);
        res.redirect('/auth/register');
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            req.flash('error_msg', 'Invalid credentials');
            return res.redirect('/auth/login');
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            req.flash('error_msg', 'Invalid credentials');
            return res.redirect('/auth/login');
        }
        req.session.user = {
            id: user._id,
            name: user.name,
            role: user.role
        };

        // Redirect based on role
        if (user.role === 'admin') return res.redirect('/admin');
        if (user.role === 'barber') return res.redirect('/barber/dashboard');
        if (user.role === 'shop_owner') return res.redirect('/shop/dashboard');
        res.redirect('/discover');
    } catch (err) {
        console.error(err);
        res.redirect('/auth/login');
    }
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/auth/login');
};
