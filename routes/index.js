const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

router.get('/', (req, res) => res.redirect('/discover'));
router.get('/discover', clientController.getDiscover);
router.get('/shop/:id', clientController.getShopProfile);

module.exports = router;
