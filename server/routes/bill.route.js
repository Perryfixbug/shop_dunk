const express = require('express');
const router = express.Router();
const billController = require('../controllers/bill.controller');
const { auth } = require('../middleware/auth');

router.use(auth); // Apply auth middleware to all routes in this file
router.post('/', billController.createBill);
router.get('/', billController.getBills);
router.put('/:id', billController.updateBill);

module.exports = router;