const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { ensureAuthenticated, authorize } = require('../middleware/auth');

router.use(ensureAuthenticated);
router.use(authorize('admin'));

router.get('/', adminController.getDashboard);
router.get('/users', adminController.getUsers);

module.exports = router;
