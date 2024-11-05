const router = require('express').Router();
const User = require('../models/userModel');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utilfol/tokenutils');


// REGISTER
router.post('/register', async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  try {
    const user = new User({ firstname, lastname, email, password });

    await user.save();

    res.status(201).json({ message: 'User registered' });
  } catch (error) {
    res.status(400).json({ message: 'Registration failed', error });
  }
});


// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  
  if (user && (await user.comparePassword(password))) {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    res.json({ accessToken, refreshToken });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});


// REFRESH
router.post('/refresh', async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });
  
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) return res.status(403).json({ message: 'Invalid refresh token' });
  
    try {
      const user = await User.findById(decoded.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      const newAccessToken = generateAccessToken(user);
      res.json({ accessToken: newAccessToken });
    } catch (error) {
      res.status(500).json({ message: 'Error refreshing token', error });
    }
  });

module.exports = router;