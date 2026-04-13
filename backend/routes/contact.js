const express = require('express');
const router = express.Router();
const db = require('../db');

// @route   POST /api/contact
// @desc    Submit a contact form message
// @access  Public
router.post('/', async (req, res) => {
    const { name, email, subject, message } = req.body;

    try {
        // Insert message into contact_messages table
        await db.query(
            'INSERT INTO contact_messages (name, email, subject, message) VALUES ($1, $2, $3, $4)',
            [name, email, subject, message]
        );

        // Also create a notification for admin
        await db.query(
            'INSERT INTO admin_notifications (message, type) VALUES ($1, $2)',
            [`New message from ${name}: ${subject}`, 'contact_form']
        );

        res.status(201).json({ message: 'Message sent successfully' });
    } catch (err) {
        console.error('Contact submit error:', err.message);
        res.status(500).json({ error: 'Server error while sending message' });
    }
});

module.exports = router;
