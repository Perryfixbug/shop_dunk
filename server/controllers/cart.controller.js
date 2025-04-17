const Cart = require('../models/carts.model');
const Product = require('../models/products.model');

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate({
      path: 'items.productId',
      strictPopulate: false,
    });
    if (!cart) return res.json({ items: [] });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product || product.stock < quantity) {
      return res.status(400).json({ message: 'Sản phẩm không khả dụng' });
    }

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) cart = new Cart({ userId: req.user.id, items: [] });

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity, price: product.actualPrice });
    }
    console.log(cart.items);
    await cart.save();
    await cart.populate('items.productId');
    res.json(cart.items);
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log(error.message);
  }
};

exports.updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex === -1) return res.status(404).json({ message: 'Sản phẩm không có trong giỏ' });

    if (quantity < 1) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    await cart.populate('items.productId');
    res.json(cart.items);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.removeCartItem = async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });

    cart.items = cart.items.filter(item => item._id.toString() !== id);
    await cart.save();
    await cart.populate('items.productId');
    res.json(cart.items);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};