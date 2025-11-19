const express = require('express');
const bcrypt = require('bcryptjs');

const { findUserByEmail, createUser } = require('../models/User');
const createToken = require('../utils/token');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const lowerEmail = email.toLowerCase();

    const existingUser = await findUserByEmail(lowerEmail);

    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await createUser({
      name,
      email: lowerEmail,
      passwordHash,
    });

    const token = createToken(user.id.toString());

    res.status(201).json({
      token,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not create user' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const lowerEmail = email.toLowerCase();

    const user = await findUserByEmail(lowerEmail);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);

    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = createToken(user.id.toString());

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed' });
  }
});

module.exports = router;
