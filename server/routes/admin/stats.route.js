const express = require('express');
const router = express.Router();
const statsController = require('../../controllers/admin/stats.controller');
const { auth, isAdmin } = require('../../middleware/auth');

router.use(auth)
router.use(isAdmin);

router.get('/', statsController.getStats);

module.exports = router;