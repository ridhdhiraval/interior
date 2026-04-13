const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Middleware for admin access
const isAdmin = async (req, res, next) => {
    try {
        console.log('Checking admin status for user ID:', req.user.id);
        const result = await db.query('SELECT role FROM users WHERE id = $1', [req.user.id]);
        if (result.rows.length > 0 && result.rows[0].role === 'admin') {
            console.log('User is admin, access granted');
            next();
        } else {
            console.log('User is not admin, access denied');
            res.status(403).json({ message: 'Access denied: Admins only' });
        }
    } catch (err) {
        console.error('isAdmin middleware error:', err.message);
        res.status(500).json({ error: err.message });
    }
};

// @route   GET /api/admin/users
router.get('/users', auth, isAdmin, async (req, res) => {
    console.log('GET /api/admin/users request received');
    try {
        const result = await db.query("SELECT id, name, email, role, status, created_at FROM users WHERE role = 'user' ORDER BY created_at DESC");
        console.log(`Found ${result.rows.length} users`);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching users:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// @route   GET /api/admin/users/:id/designs
router.get('/users/:id/designs', auth, isAdmin, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM designs WHERE user_id = $1 ORDER BY created_at DESC', [req.params.id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   PUT /api/admin/users/:id/plan
router.get('/users/:id', auth, isAdmin, async (req, res) => {
    try {
        const result = await db.query('SELECT id, name, email, role, plan, created_at FROM users WHERE id = $1', [req.params.id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/users/:id/plan', auth, isAdmin, async (req, res) => {
    try {
        const { plan } = req.body;
        const result = await db.query('UPDATE users SET plan = $1 WHERE id = $2 RETURNING id, name, plan', [plan, req.params.id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   PUT /api/admin/users/:id/status
router.put('/users/:id/status', auth, isAdmin, async (req, res) => {
    try {
        const { status } = req.body; // 'Active', 'Disabled', 'Deactivated'
        const result = await db.query('UPDATE users SET status = $1 WHERE id = $2 RETURNING id, name, status', [status, req.params.id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   GET /api/admin/analytics
router.get('/analytics', auth, isAdmin, async (req, res) => {
    try {
        const userCount = await db.query("SELECT COUNT(*) FROM users WHERE role = 'user'");
        const orderCount = await db.query('SELECT COUNT(*) FROM orders');
        const revenueResult = await db.query("SELECT SUM(amount) FROM orders WHERE status = 'paid'");

        res.json({
            users: parseInt(userCount.rows[0].count),
            orders: parseInt(orderCount.rows[0].count),
            revenue: parseFloat(revenueResult.rows[0].sum || 0)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   GET /api/admin/analytics/detailed
router.get('/analytics/detailed', auth, isAdmin, async (req, res) => {
    try {
        const range = req.query.range || 7;
        const revenueResult = await db.query(
            "SELECT DATE_TRUNC('day', created_at) as date, SUM(amount) as revenue FROM orders WHERE status = 'paid' AND created_at >= CURRENT_DATE - INTERVAL '1 day' * $1 GROUP BY date ORDER BY date",
            [range]
        );
        const signupsResult = await db.query(
            "SELECT DATE_TRUNC('day', created_at) as date, COUNT(*) as count FROM users WHERE role = 'user' AND created_at >= CURRENT_DATE - INTERVAL '1 day' * $1 GROUP BY date ORDER BY date",
            [range]
        );
        const planResult = await db.query(
            "SELECT plan_type, COUNT(*) FROM orders WHERE status = 'paid' GROUP BY plan_type"
        );
        const activeUsers = await db.query("SELECT COUNT(*) FROM users WHERE role = 'user'");
        const totalRevenue = await db.query("SELECT SUM(amount) FROM orders WHERE status = 'paid'");

        res.json({
            revenueByDay: revenueResult.rows,
            signupsByDay: signupsResult.rows,
            planStats: planResult.rows,
            activeUsers: parseInt(activeUsers.rows[0].count),
            revenueTotal: parseFloat(totalRevenue.rows[0].sum || 0)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   GET /api/admin/orders
router.get('/orders', auth, isAdmin, async (req, res) => {
    try {
        const result = await db.query('SELECT o.*, u.name as user_name FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   GET /api/admin/contacts
router.get('/contacts', auth, isAdmin, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   PUT /api/admin/contacts/:id/resolve
router.put('/contacts/:id/resolve', auth, isAdmin, async (req, res) => {
    try {
        const result = await db.query('UPDATE contact_messages SET is_resolved = TRUE WHERE id = $1 RETURNING *', [req.params.id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   GET /api/admin/settings
router.get('/settings', auth, isAdmin, async (req, res) => {
    try {
        // Return dummy settings for now, can be stored in a 'settings' table later
        res.json({
            siteName: 'Interior Design',
            supportEmail: 'support@interior.design',
            currency: 'USD',
            invoicePrefix: 'INT-'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   POST /api/admin/notify-user
router.post('/notify-user', auth, isAdmin, async (req, res) => {
    try {
        console.log('Notification request received:', req.body);
        const { userId, text } = req.body; 
        
        if (!text) {
            console.log('Error: Notification text missing');
            return res.status(400).json({ error: 'Notification text is required' });
        }

        if (userId === 'all') {
            console.log('Sending notification to all users');
            await db.query(
                'INSERT INTO user_notifications (user_id, message) SELECT id, $1 FROM users WHERE role = \'user\'',
                [text]
            );
        } else {
            console.log(`Sending notification to user ID: ${userId}`);
            await db.query(
                'INSERT INTO user_notifications (user_id, message) VALUES ($1, $2)',
                [parseInt(userId), text]
            );
        }
        
        res.json({ message: 'Notification sent successfully' });
    } catch (err) {
        console.error('Notify error details:', err);
        res.status(500).json({ error: err.message });
    }
});

// @route   GET /api/admin/notifications
router.get('/notifications', auth, isAdmin, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM admin_notifications ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   PUT /api/admin/notifications/:id
router.put('/notifications/:id', auth, isAdmin, async (req, res) => {
    try {
        const result = await db.query('UPDATE admin_notifications SET is_read = TRUE WHERE id = $1 RETURNING *', [req.params.id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
