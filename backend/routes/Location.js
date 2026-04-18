import { Router } from 'express';
import { execute } from '../db.js';
import authMiddleware from '../middleware/auth.js';

const router = Router();

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const [rows] = await execute("SELECT * FROM categories");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all locations
router.get('/', async (req, res) => {
  try {
    const [rows] = await execute(`
      SELECT l.*, c.name as category_name, c.slug as category_slug
      FROM locations l
      LEFT JOIN categories c ON l.category_id = c.id
      ORDER BY l.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create location (protected)
router.post('/', authMiddleware, async (req, res) => {
  const { name, description, short_desc, lat, lng, category_id, image, address, district, price_range, best_time, opening_hours, website, phone, is_featured } = req.body;
  const slug = name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  try {
    const [result] = await execute(
      `INSERT INTO locations 
       (name, slug, description, short_desc, lat, lng, category_id, image, address, district, price_range, best_time, opening_hours, website, phone, is_featured) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, slug, description, short_desc, lat, lng, category_id, image, address, district, price_range, best_time, opening_hours, website, phone, is_featured ? 1 : 0]
    );
    res.status(201).json({ id: result.insertId, slug, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update location (protected)
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, description, short_desc, lat, lng, category_id, image, address, district, price_range, best_time, opening_hours, website, phone, is_featured } = req.body;
  const slug = name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  try {
    await execute(
      `UPDATE locations SET name=?, slug=?, description=?, short_desc=?, lat=?, lng=?, category_id=?, image=?,
       address=?, district=?, price_range=?, best_time=?, opening_hours=?, website=?, phone=?, is_featured=? WHERE id=?`,
      [name, slug, description, short_desc, lat, lng, category_id, image, address, district, price_range, best_time, opening_hours, website, phone, is_featured ? 1 : 0, id]
    );
    res.json({ id, message: 'Location updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete location (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await execute("DELETE FROM locations WHERE id = ?", [id]);
    res.json({ message: 'Location deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;