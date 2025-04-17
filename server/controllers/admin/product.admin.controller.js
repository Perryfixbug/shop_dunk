const Product = require('../../models/products.model');

exports.getProducts = async (req, res) => {
    try {
      const products = await Product.find({});
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

exports.createProduct = async (req, res) => {
    try {
        const { name, originalPrice, discount, actualPrice, description, images, category, color, isNew, stock } = req.body;
        const newProduct = new Product({
            name,
            originalPrice,
            discount,
            actualPrice,
            description,
            images,
            category,
            color,
            isNew,
            stock,
        });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const { name, originalPrice, discount, actualPrice, description, images, category, color, isNew, stock } = req.body;
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        
        // Cập nhật các trường nếu được cung cấp
        if (name) product.name = name;
        if (originalPrice) product.originalPrice = originalPrice;
        if (discount) product.discount = discount;
        if (actualPrice) product.actualPrice = actualPrice;
        if (description) product.description = description;
        if (images) product.images = images;
        if (category) product.category = category;
        if (color) product.color = color;
        if (isNew !== undefined) product.isNew = isNew; // Kiểm tra giá trị boolean
        if (stock !== undefined) product.stock = stock; // Kiểm tra giá trị số
        
        await product.save();
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        res.json({ message: 'Sản phẩm đã được xóa thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}