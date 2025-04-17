const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { create } = require('./products.model');


const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Tên là bắt buộc'],
    default: ''
  },
  lastName: {
    type: String,
    required: [true, 'Họ là bắt buộc'],
    default: ''
  },
  email: {
    type: String,
    required: [true, 'Email là bắt buộc'],
    unique: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Email không hợp lệ']
  },
  password: {
    type: String,
    required: [true, 'Mật khẩu là bắt buộc'],
    minlength: 8,
    select: false // Không trả về password khi query mặc định
  },
  address: {
    address:{
      type: String,
      default: ''
    }, 
    ward:{
      type: String,
      default: ''
    }, 
    district:{
      type: String,
      default: ''
    },
    province:{
      type: String,
      default: ''
    }
  },
  birthDate: {
    type: Date,
    default: null
  },
  phone: {
    type: String,
    match: [/^\d{10,11}$/, 'Số điện thoại không hợp lệ'],
    default: ''
  },
  orders:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bill'
  }],
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  createAt: {
    type: Date,
    default: Date.now
  },
});

// Hash password trước khi save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// So sánh password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);