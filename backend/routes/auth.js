import 'dotenv/config';                    // ← ADD THIS LINE AT THE TOP
import { Router } from 'express';
import { execute } from '../db.js';
import { compareSync } from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  console.log(`🔑 Login attempt for: ${username}`);

  try {
    const [rows] = await execute(
      "SELECT id, username, email, full_name, avatar, role, password FROM users WHERE username = ?",
      [username]
    );

    const user = rows[0];

    if (!user) {
      console.log('❌ User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!compareSync(password, user.password)) {
      console.log('❌ Wrong password');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Safety check
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET is missing in .env file!');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Login successful');
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('🚨 Login error:', err.message);
    res.status(500).json({ message: 'Server error during login' });
  }
});

export default router;