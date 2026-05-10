const express = require('express');
const router = express.Router();
const loyaltyController = require('../controllers/loyaltyController');
const notificationController = require('../controllers/notificationController');
const marketplaceController = require('../controllers/marketplaceController');
const { ensureAuthenticated } = require('../middleware/auth');

router.use(ensureAuthenticated);

router.get('/loyalty', loyaltyController.getLoyaltyPage);
router.get('/notifications', notificationController.getNotifications);
router.get('/marketplace', marketplaceController.getMarketplace);
router.post('/marketplace/order', marketplaceController.placeOrder);

module.exports = router;
