const User = require('../../models/users.model');

module.exports.getUsers = async (req, res) => {
    try{
        const users = await User.find({}).populate({
            path: 'orders',
            strictPopulate: false,
        }).select('-__v')
        if(!users) return res.status(404).json({message: 'Không tìm thấy người dùng'})
        res.json(users)
    }catch(error){
        res.status(500).json({message: error.message})
    }
}

exports.createUser = async (req, res) => {
    try{
        const { email, password, firstName, lastName, phone, birthDate, address, role } = req.body;

        // Kiểm tra các trường bắt buộc
        if (!email || !password) {
            return res.status(400).json({ message: 'Email và mật khẩu là bắt buộc' });
        }

        // Kiểm tra xem người dùng đã tồn tại chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Người dùng đã tồn tại' });
        }

        // Tạo người dùng mới
        const newUser = new User({
            email,
            password,
            firstName,
            lastName,
            phone,
            birthDate,
            address,
            role: role || 'user', // Mặc định là 'user' nếu không có role
        });

        await newUser.save();
        res.status(201).json(newUser);
    }catch(error){
        res.status(500).json({message: error.message})
    }
}

exports.updateUser = async (req, res) => {
    try{
        const { firstName, lastName, email, phone, status, role, password } = req.body;
        const user = await User.findById(req.params.id);
        if(!user) return res.status(404).json({message: 'Không tìm thấy người dùng'})
        
        // Cập nhật các trường nếu được cung cấp
        if(firstName) user.firstName = firstName;
        if(lastName) user.lastName = lastName;
        if(email) user.email = email;
        if(phone) user.phone = phone;
        if(status) user.status = status; // Cập nhật trạng thái nếu có
        if(password) user.password = password; // Cập nhật mật khẩu nếu có
        if(role === 'admin' || role === 'user') user.role = role; // Chỉ cập nhật vai trò nếu là admin hoặc user

        await user.save();
        res.json(user);
    }catch(error){
        res.status(500).json({message: error.message})
    }
}

exports.deleteUser = async (req, res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user) return res.status(404).json({message: 'Không tìm thấy người dùng'})
        res.json({message: 'Người dùng đã được xóa thành công'})
    }catch(error){
        res.status(500).json({message: error.message})
    }
}