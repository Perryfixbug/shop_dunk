const jwt = require('jsonwebtoken');
const jwt_key = process.env.JWT_SECRET

module.exports.auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Không có token' });
  
  try {
    const decoded = jwt.verify(token, jwt_key); 
    req.user = decoded;
    next(); 
  } catch (error) {
    res.status(401).json({ message: 'Token không hợp lệ' });
  }
};

module.exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Không có quyền truy cập' });
  next();
}