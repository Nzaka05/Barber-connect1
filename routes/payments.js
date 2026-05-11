const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/checkout/:id', ensureAuthenticated, paymentController.getCheckout);
router.post('/stkpush', ensureAuthenticated, paymentController.stkPush);

module.exports = router;
