// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.authenticate = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.id);
    if (!req.user) {
      return res.status(401).json({ message: "Invalid token." });
    }
    next();
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Invalid token." });
  }
};

exports.generateToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

exports.authorize = (roles) => {
  return (req, res, next) => {
    console.log(req.user.role);
    if (!req.user) {
      return res.status(401).json({ message: "Access denied." });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied." });
    }
    next();
  };
};
