const User = require('../models/User');

exports.getLoyaltyPage = async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id);
        res.render('loyalty', { user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
