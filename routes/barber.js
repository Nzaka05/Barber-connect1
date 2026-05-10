const express = require('express');
const router = express.Router();
const barberController = require('../controllers/barberController');
const { ensureAuthenticated, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(ensureAuthenticated);
router.use(authorize('barber', 'shop_owner', 'admin'));

router.get('/dashboard', barberController.getDashboard);
router.post('/update-booking', barberController.updateBookingStatus);
router.get('/manage-services', barberController.getManageServices);
router.post('/add-service', upload.single('image'), barberController.addService);
router.get('/manage-staff', barberController.getStaffManagement);
router.post('/assign-shift', barberController.assignShift);

module.exports = router;
