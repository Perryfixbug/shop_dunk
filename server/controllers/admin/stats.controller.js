const User = require('../../models/users.model');
const Product = require('../../models/products.model');
const Bill = require('../../models/bills.model');

exports.getStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const newUserCount = await User.countDocuments({ createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } });
        const productCount = await Product.countDocuments();
        const outOfStockCount = await Product.countDocuments({ quantity: 0 });
        const billCount = await Bill.countDocuments();
        const newBillCount = await Bill.countDocuments({ createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } });
        const tenNewBills = await Bill.find({}).sort({ createdAt: -1 }).limit(10).populate('userId', 'firstName lastName');
        const soldProductsCount = await Bill.aggregate([
            { $unwind: '$items' },
            { $group: { _id: null, totalSold: { $sum: '$items.quantity' } } }
        ]);
        
        const totalRevenue = await Bill.aggregate([
        {
            $group: {
            _id: null,
            totalRevenue: { $sum: '$total' }
            }
        }
        ]);
    
        res.status(200).json({
        userCount,
        newUserCount,
        productCount,
        outOfStockCount,
        billCount,
        newBillCount,
        tenNewBills,
        soldProductsCount: soldProductsCount[0] ? soldProductsCount[0].totalSold : 0,
        totalRevenue: totalRevenue[0] ? totalRevenue[0].totalRevenue : 0
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error });
    }
}