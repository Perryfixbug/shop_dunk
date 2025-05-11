const fs = require('fs');
const cloudinaryService = require('../services/cloudinary.service');
const Product = require('../models/products.model')

module.exports.upload = async (req, res) =>{
    try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadedUrls = [];

    for (const file of files) {
      const result = await cloudinaryService.uploadToCloudinary(file.path, 'shopdunk_images');
      uploadedUrls.push(result.secure_url);
      fs.unlinkSync(file.path); // Xoá file tạm
    }

    res.status(200).json({ message: 'Upload successful', urls: uploadedUrls });
  } catch (err) {
    console.error('Image upload error:', err);
    res.status(500).json({ error: 'Failed to upload images' });
  }
}

module.exports.delete = async (req, res) => {
  try {
    const { imageUrl, productId } = req.body;

    if (!imageUrl || !productId) {
      return res.status(400).json({ error: 'Missing imageUrl or productId' });
    }

    // Lấy public_id từ URL
    const parts = imageUrl.split('/');
    const public_id_with_ext = parts.slice(-2).join('/'); // e.g. shopdunk_images/image123.jpg
    const public_id = public_id_with_ext.replace(/\.[^/.]+$/, ""); // remove .jpg/.png

    // Xoá ảnh khỏi Cloudinary
    await cloudinaryService.deleteFromCloudinary(public_id);

    // Cập nhật Product: xoá URL khỏi mảng images
    await Product.findByIdAndUpdate(productId, {
      $pull: { images: imageUrl }
    });

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (err) {
    console.error('Image delete error:', err);
    res.status(500).json({ error: 'Failed to delete image' });
  }
};