const User = require('../models/users.model');
const jwt = require('jsonwebtoken');
const jwt_key = process.env.JWT_SECRET
const mongoose = require('mongoose');

module.exports.register = async (req, res) => {
  try {
    console.log(req.body);
    const { firstName, lastName, email, password, phone } = req.body;
    const user = new User({ firstName, lastName, email, password, phone });
    await user.save();
    console.log({message: 'Đăng ký thành công'});
    res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, jwt_key, { expiresIn: '12h' });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
