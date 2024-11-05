const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { JWT_SECRET } = process.env.JWT_SECRET;

async function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    next();
  } catch {
    return res.status(403).json({ message: 'Invalid token' });
  }
}

function authorizeUser(req, res, next) {
  if (req.todo.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
}

module.exports = { authenticateToken, authorizeUser };