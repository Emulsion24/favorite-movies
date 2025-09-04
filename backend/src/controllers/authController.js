const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user', // default
    });

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Save token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,   // cannot be accessed by JS
      secure: process.env.NODE_ENV === 'production', // only HTTPS in prod
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
  
    // Also return minimal info in body
    res.json({ message: 'Login successful', user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};
 exports.CheckAuth=(req, res) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "Not authenticated" }).console.log("jj");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user: { email: decoded.email ,
      role: decoded.role,id:decoded.id} });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};


