const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { formatResponse } = require('../utils/responseFormatter');
 const uuid = require('uuid');
const { generateToken } = require('../middlewares/authMiddleware');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json(formatResponse('User already exists', null));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      id: uuid.v4(),
      name,
      email,
      password: hashedPassword,
      phone,
      role: 'user',
    });

    // Send confirmation email (optional)
    // await sendMail(email, 'Welcome to Our Service', 'welcome', { name });

    res.status(201).json(formatResponse('User registered successfully', newUser));
  } catch (error) {
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

    res.status(200).json(formatResponse('Login successful', { token, user }));
  } catch (error) {
    next(error);
  }
};