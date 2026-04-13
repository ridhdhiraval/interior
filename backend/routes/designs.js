const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// @route   GET /api/designs
router.get('/', auth, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM designs WHERE user_id = $1 ORDER BY updated_at DESC', [req.user.id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   POST /api/designs
router.post('/', auth, async (req, res) => {
    const { name, design_data, thumbnail_url } = req.body;

    try {
        const result = await db.query(
            'INSERT INTO designs (user_id, name, design_data, thumbnail_url) VALUES ($1, $2, $3, $4) RETURNING *',
            [req.user.id, name, design_data, thumbnail_url]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   PUT /api/designs/:id
router.put('/:id', auth, async (req, res) => {
    const { name, design_data, thumbnail_url } = req.body;

    try {
        const result = await db.query(
            'UPDATE designs SET name = $1, design_data = $2, thumbnail_url = $3 WHERE id = $4 AND user_id = $5 RETURNING *',
            [name, design_data, thumbnail_url, req.params.id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Design not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   DELETE /api/designs/:id
router.delete('/:id', auth, async (req, res) => {
    try {
        const result = await db.query('DELETE FROM designs WHERE id = $1 AND user_id = $2 RETURNING id', [req.params.id, req.user.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Design not found' });
        }
        res.json({ message: 'Design deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   GET /api/designs
// @desc    Get all designs for the current user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM designs WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
