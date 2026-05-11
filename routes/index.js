const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

router.get('/', (req, res) => res.redirect('/discover'));
router.get('/discover', clientController.getDiscover);
router.get('/shop/:id', clientController.getShopProfile);
router.post('/shop/waitlist', clientController.joinWaitlist);
router.post('/shop/review', clientController.addReview);
router.post('/barber/follow/:id', clientController.followBarber);

module.exports = router;
