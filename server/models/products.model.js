const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tên sản phẩm là bắt buộc'],
    trim: true
  },
  originalPrice: {
    type: Number,
    required: [true, 'Giá là bắt buộc'],
    min: 0
  },
  actualPrice: {
    type: Number,
    min: 0
  },
  description: {
    type: String,
    default: ''
  },
  stock: {
    type: Number,
    required: [true, 'Số lượng tồn kho là bắt buộc'],
    min: 0
  },
  images: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    required: [true, 'Danh mục là bắt buộc'],
    enum: ['iPhone', 'iPad', 'Mac', 'Watch', 'Phụ kiện', 'Máy lướt', 'Âm thanh']
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  color: {
    type: String,
    required: [true, 'Màu sắc là bắt buộc'],
    enum: ['red', 'blue', 'green', 'black', 'white']
  },
  isNew: {
    type: Boolean,
    default: false
  }
},{
  suppressReservedKeysWarning: true
});

productSchema.pre('save', function(next) {
  //Tính lại giá thực tế khi có giảm giá
  this.actualPrice = this.originalPrice - (this.originalPrice * this.discount) / 100;
  next();
})

// Index để tìm kiếm nhanh
productSchema.index({ name: 'text', category: 1 });
const Product = mongoose.model('Product', productSchema, 'products');

module.exports = Product;