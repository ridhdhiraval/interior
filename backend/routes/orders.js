const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

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

// @route   POST /api/orders/confirm-upi
// @desc    Confirm UPI payment and update user plan
// @access  Private
router.post('/confirm-upi', auth, async (req, res) => {
    const { plan_type, amount } = req.body;
    console.log('--- UPI Confirmation Attempt ---');
    console.log('User ID:', req.user.id);
    console.log('Plan:', plan_type);
    console.log('Amount:', amount);

    const order_id = `UPI_${Date.now()}`;

    try {
        // 1. Create a successful order record
        await db.query(
            'INSERT INTO orders (user_id, order_id, amount, status, plan_type) VALUES ($1, $2, $3, $4, $5)',
            [req.user.id, order_id, amount, 'paid', plan_type]
        );

        // 2. Update user's plan in users table
        await db.query(
            'UPDATE users SET plan = $1 WHERE id = $2',
            [plan_type.toUpperCase(), req.user.id]
        );

        // 3. Create a notification for the user
        await db.query(
            'INSERT INTO user_notifications (user_id, message) VALUES ($1, $2)',
            [req.user.id, `Your subscription to ${plan_type} plan was successful!`]
        );

        // 4. Create an admin notification
        const settingsResult = await db.query("SELECT value FROM global_settings WHERE key = 'currency'");
        const currency = settingsResult.rows[0]?.value || 'INR';
        const symbols = { 'USD': '$', 'INR': '₹', 'EUR': '€', 'GBP': '£' };
        const symbol = symbols[currency] || currency;

        await db.query(
            'INSERT INTO admin_notifications (message, type) VALUES ($1, $2)',
            [`New UPI payment of ${symbol}${amount} for ${plan_type} plan by user ID ${req.user.id}`, 'new_order']
        );

        res.json({ message: 'Payment confirmed and plan updated successfully' });
    } catch (err) {
        console.error('UPI Confirmation Error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
