const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { formatResponse } = require('../utils/responseFormatter');
 const uuid = require('uuid');
const { generateToken } = require('../middlewares/authMiddleware');
const { sendMail } = require('../utils/mailer');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, phone } = req.body;

    if (!name,!email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (password.length < 8 || confirmPassword.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Password and confirm password do not match' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const newUser = await User.create({
      id: uuid.v4(),
      name,
      email,
      password: hashedPassword,
      phone,
      role: 'user',
    });

    return res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error(error); // Log lỗi để xem chi tiết
    next(error);
  }
};


exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json(formatResponse('Invalid email or password', null));
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json(formatResponse('Invalid email or password', null));
    }

    // Generate token
    const token = generateToken(user);

    res.status(200).json(formatResponse('Login successfully', { token, user }));
  } catch (error) {
    next(error);
  }
};

exports.loginManager = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json(formatResponse('Invalid email or password', null));
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json(formatResponse('Invalid email or password', null));
    }

    if (user.role !== 'manager') {
      return res.status(403).json(formatResponse('Access denied', null));
    }

    // Generate token
    const token = generateToken(user);

    res.status(200).json(formatResponse('Login successful', { token, user }));
  } catch (error) {
    next(error);
  }
}

exports.getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) {
      return res.status(404).json(formatResponse('User not found', null));
    }
    res.status(200).json(formatResponse('User retrieved successfully', user));
  } catch (error) {
    next(error);
  }
};

exports.updateUserInfo = async (req, res, next) => {
  try {
    const { name, default_address, phone, avatar } = req.body; // Thêm avatar vào req.body

    // Xác thực dữ liệu đầu vào
    if (name && (typeof name !== 'string' || name.length < 2 || name.length > 100)) {
      return res.status(400).json(formatResponse('Invalid name', null));
    }

    if (default_address && typeof default_address !== 'string') {
      return res.status(400).json(formatResponse('Invalid address', null));
    }

    if (phone && !/^\d+$/.test(phone)) {
      return res.status(400).json(formatResponse('Invalid phone number', null));
    }

    if (avatar && typeof avatar !== 'string') {
      return res.status(400).json(formatResponse('Invalid avatar', null));
    }

    // Tìm người dùng
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) {
      return res.status(404).json(formatResponse('User not found', null));
    }

    // Cập nhật các trường thay đổi
    if (name) user.name = name;
    if (default_address) user.default_address = default_address;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar; // Cập nhật trường avatar

    await user.save();

    res.status(200).json(formatResponse('User updated successfully', {
      id: user.id,
      name: user.name,
      default_address: user.default_address,
      phone: user.phone,
      avatar: user.avatar, // Trả về thông tin avatar
    }));
  } catch (error) {
    console.error('Error updating user:', error);
    next(error);
  }
};



exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Kiểm tra đầu vào
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json(formatResponse('All fields are required', null));
    }

    if (newPassword.length < 8) {
      return res.status(400).json(formatResponse('New password must be at least 8 characters long', null));
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json(formatResponse('New password and confirm password do not match', null));
    }

    // Lấy thông tin người dùng từ ID đã được xác thực
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) {
      return res.status(404).json(formatResponse('User not found', null));
    }

    // Kiểm tra mật khẩu hiện tại
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json(formatResponse('Current password is incorrect', null));
    }

    // Hash mật khẩu mới
    user.password = await bcrypt.hash(newPassword, 10);

    // Lưu thay đổi
    await user.save();

    res.status(200).json(formatResponse('Password changed successfully', null));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Gửi email đặt lại mật khẩu
exports.requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json(formatResponse('User not found', null));
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const resetLink = `http://localhost:3000/reset-password/${token}`;
    await sendMail(email, 'Đặt lại mật khẩu', 'resetPassword', { link: resetLink });
    res.status(200).json(formatResponse('Liên kết đặt lại mật khẩu đã được gửi đến email của bạn.', null));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Cập nhật mật khẩu mới
// Hàm reset password trong backend
exports.resetPassword = async (req, res, next) => {
  // Lấy token từ header 'Authorization'
  const token = req.headers['authorization']?.split(' ')[1]; // Tách token từ "Bearer <token>"

  // Kiểm tra nếu không có token
  if (!token) {
    return res.status(400).json({ message: 'JWT must be provided' });
  }

  try {
    // Xác minh token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Đảm bảo token hợp lệ

    // Tiến hành logic reset password
    const user = await User.findOne({ where: { id: decoded.id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Tiến hành cập nhật mật khẩu mới
    user.password = await bcrypt.hash(req.body.newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Token verification failed' });
  }
};

