const authRoue = require('./auth.route');
const productRoute = require('./product.route');
const cartRoute = require('./cart.route');
const billRoute = require('./bill.route');
const userRoute = require('./user.route');
const adminProductRoute = require('./admin/product.admin.route');
const adminBillRoute = require('./admin/bill.admin.route');
const adminUserRoute = require('./admin/user.admin.route');
const adminStatsRoute = require('./admin/stats.route');

module.exports = (app)=>{
    
    app
        .use('/api/auth', authRoue)
        .use('/api/products', productRoute)
        .use('/api/carts', cartRoute)
        .use('/api/bills', billRoute)
        .use('/api/users', userRoute)
        .use('/api/admin/products', adminProductRoute)
        .use('/api/admin/bills', adminBillRoute)
        .use('/api/admin/users', adminUserRoute)
        .use('/api/admin/stats', adminStatsRoute)
}   

