const express = require('express');
const router = express.Router();
const billController = require('../../controllers/admin/bill.admin.controller');
const { auth, isAdmin } = require('../../middleware/auth');

router.use(auth); 
router.use(isAdmin); // Apply isAdmin middleware to all routes in this file

router.get('/', billController.getBills); // Get all bills
router.put('/:id', billController.updateBill); // Update a bill by ID

module.exports = router;