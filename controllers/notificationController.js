const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.session.user.id }).sort({ createdAt: -1 });
        res.render('notifications', { notifications });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.markAsRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { read: true });
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.createNotification = async (userId, title, message) => {
    try {
        const notification = new Notification({ user: userId, title, message });
        await notification.save();
    } catch (err) {
        console.error('Notification creation failed:', err);
    }
};
