const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { formatResponse } = require('../utils/responseFormatter');
 const uuid = require('uuid');
const { generateToken } = require('../middlewares/authMiddleware');

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
    const { name, email, phone, password } = req.body;
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) {
      return res.status(404).json(formatResponse('User not found', null));
    }

    // Update user fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    // Hash new password if provided
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.status(200).json(formatResponse('User updated successfully', user));
  } catch (error) {
    next(error);
  }
};
