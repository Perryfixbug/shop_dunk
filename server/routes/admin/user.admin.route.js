const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../../middleware/auth');
const userController = require('../../controllers/admin/user.admin.controller');

router.use(auth);
router.use(isAdmin);

router.get('/', userController.getUsers);
router.post('/', userController.createUser);    
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;