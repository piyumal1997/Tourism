import { Router } from 'express';
import { execute } from '../db.js';
import authMiddleware from '../middleware/auth.js';

const router = Router();

// Get current logged-in user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const [rows] = await execute(
      "SELECT id, username, email, full_name, avatar, role FROM users WHERE id = ?",
      [req.user.id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;