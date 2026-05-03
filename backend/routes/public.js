const express = require('express');
const router = express.Router();
const db = require('../db');

// @route   GET /api/public/settings
// @desc    Get public global settings (site name, currency)
router.get('/settings', async (req, res) => {
    try {
        const result = await db.query('SELECT key, value FROM global_settings');
        const settings = {};
        result.rows.forEach(row => {
            settings[row.key] = row.value;
        });
        
        const formattedSettings = {
            siteName: settings.site_name || 'Iconic Interior',
            supportEmail: settings.support_email || 'support@iconicinterior.com',
            currency: settings.currency || 'INR',
            invoicePrefix: settings.invoice_prefix || 'INT-'
        };
        
        res.json(formattedSettings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   GET /api/public/plans
// @desc    Get public plan details (prices)
router.get('/plans', async (req, res) => {
    try {
        const result = await db.query('SELECT plan_name as name, monthly_price as monthly, yearly_price as yearly FROM plan_details ORDER BY name');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
