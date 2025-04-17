const User = require('../models/users.model');

// Lấy thông tin người dùng
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'orders', // Lấy dữ liệu từ Bill
      populate: {
        path: 'items.productId', // Lấy dữ liệu từ Product trong items của Bill
        strictPopulate: false, // Bỏ qua lỗi nếu không tìm thấy Product
      }
    }).select('-__v'); // Loại bỏ trường __v
    console.log(user);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật thông tin người dùng
exports.updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, birthDate, address } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    // Cập nhật các trường nếu được cung cấp
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (birthDate) user.birthDate = new Date(birthDate);
    if (address) user.address = address;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Xóa tài khoản người dùng
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    res.json({ message: 'Tài khoản đã được xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

