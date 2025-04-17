const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { auth } = require('../middleware/auth');

// Yêu cầu xác thực cho tất cả route
router.use(auth);

// Lấy thông tin người dùng
router.get('/me', userController.getUser);

// Cập nhật thông tin người dùng
router.put('/me', userController.updateUser);

// Xóa tài khoản người dùng
router.delete('/me', userController.deleteUser);


module.exports = router;