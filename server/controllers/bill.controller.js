const Bill = require('../models/bills.model');
const Product = require('../models/products.model');
const User = require('../models/users.model');

exports.createBill = async (req, res) => {
  try {
    const {items, total, status, shippingAddress } = req.body
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Sản phẩm ${product.name} không đủ hàng` });
      }
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
    }
    const bill = new Bill({
      userId: req.user.id,
      items: items,
      total: total,
      status: status || "Chờ xác nhận",
      shippingAddress: shippingAddress,
    });
    
    await bill.save();
    await bill.populate('items.productId');

    //cập nhật bill vào user
    await User.findByIdAndUpdate(req.user.id, {
      $push: { orders: bill._id }
    });
    res.status(201).json(bill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getBills = async (req, res) => {
  try {
    const bills = await Bill.find({ userId: req.user.id }).populate('items.productId');
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBill = async (req, res) => {
  try {
    const { status } = req.body;
    const bill = await Bill.findById(req.params.id);
    if (!bill) return res.status(404).json({ message: 'Không tìm thấy hóa đơn' });

    bill.status = status;
    await bill.save();
    res.json(bill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}