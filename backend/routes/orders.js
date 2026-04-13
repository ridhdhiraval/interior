const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

// Middleware for authentication
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// @route   GET /api/orders
router.get('/', auth, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   POST /api/orders
router.post('/', auth, async (req, res) => {
    const { order_id, amount, currency, plan_type } = req.body;

    try {
        const result = await db.query(
            'INSERT INTO orders (user_id, order_id, amount, currency, plan_type) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [req.user.id, order_id, amount, currency, plan_type]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   PUT /api/orders/:order_id
router.put('/:order_id', auth, async (req, res) => {
    const { status } = req.body;

    try {
        const result = await db.query(
            'UPDATE orders SET status = $1 WHERE order_id = $2 AND user_id = $3 RETURNING *',
            [status, req.params.order_id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
