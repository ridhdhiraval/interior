const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const nodemailer = require('nodemailer');
const db = require('../db');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const auth = require('../middleware/auth');

// @route   POST /api/auth/google
router.post('/google', async (req, res) => {
    const { access_token } = req.body;
    console.log('Received access_token:', access_token ? 'Exists' : 'Missing');
    try {
        // Get user info from Google
        const googleRes = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
        let userData;
        try {
            userData = await googleRes.json();
        } catch (jsonErr) {
            console.error('Failed to parse Google userinfo response:', jsonErr);
            return res.status(500).json({ message: 'Failed to parse Google userinfo response' });
        }
        
        if (!googleRes.ok) {
            console.error('Google UserInfo API Error:', userData);
            return res.status(googleRes.status).json({ message: 'Google login failed', detail: userData });
        }

        const { name, email, picture } = userData;
        console.log('User info from Google:', { name, email });

        // Check if user exists
        let userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        let user;

        if (userResult.rows.length === 0) {
            // Register new user
            console.log('Registering new user via Google:', email);
            const result = await db.query(
                'INSERT INTO users (name, email, profile_pic, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at',
                [name, email, picture, 'user']
            );
            user = result.rows[0];
        } else {
            user = userResult.rows[0];
            console.log('User logged in via Google:', email);
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
        res.json({ user, token });
    } catch (err) {
        console.error('Google Auth Route Error:', err);
        res.status(500).json({ message: 'Internal Server Error during Google login', error: err.message });
    }
});

// @route   POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    console.log('--- Forgot Password Attempt ---');
    console.log('Email:', email);
    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            console.log('User not found in database');
            return res.status(404).json({ message: 'User not found. Please register first.' });
        }

        const user = result.rows[0];
        console.log('User found:', { id: user.id, hasPassword: !!user.password });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const resetLink = `http://localhost:5173/reset-password/${token}`;
        
        console.log('Reset Link:', resetLink);
        console.log('Configuring Nodemailer with:', process.env.EMAIL_USER);

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error('EMAIL_USER or EMAIL_PASS is missing in .env');
            return res.status(500).json({ message: 'Server email configuration missing' });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"Iconic Interior" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Password Reset Request - Iconic Interior',
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e1e8ed; border-radius: 15px; background-color: #ffffff;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #1f3544; margin: 0; font-size: 28px; letter-spacing: 1px;">ICONIC INTERIOR</h1>
                    </div>
                    <p style="font-size: 16px; color: #444; line-height: 1.6;">Hello,</p>
                    <p style="font-size: 16px; color: #444; line-height: 1.6;">We received a request to reset the password for your account. If you didn't make this request, you can safely ignore this email.</p>
                    <div style="text-align: center; margin: 40px 0;">
                        <a href="${resetLink}" style="background-color: #4f7cff; color: #ffffff; padding: 15px 35px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 10px rgba(79, 124, 255, 0.3);">Reset My Password</a>
                    </div>
                    <p style="font-size: 14px; color: #888; text-align: center;">This link will remain active for 1 hour only.</p>
                    <hr style="border: none; border-top: 1px solid #e1e8ed; margin: 30px 0;" />
                    <p style="font-size: 12px; color: #aaa; text-align: center;">&copy; 2026 Iconic Interior Design Studio. All rights reserved.</p>
                </div>
            `
        };

        console.log('Sending email...');
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');

        res.json({ message: 'Reset link sent to your email' });
    } catch (err) {
        console.error('CRITICAL ERROR in forgot-password:', err);
        res.status(500).json({ message: 'Email sending failed: ' + err.message });
    }
});

// @route   POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        await db.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, decoded.id]);
        
        res.json({ message: 'Password reset successfully' });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Invalid or expired token' });
    }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        console.log('Fetching user profile for ID:', req.user.id);
        const result = await db.query(
            'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
            [req.user.id]
        );
        if (result.rows.length === 0) {
            console.log('User not found in DB for ID:', req.user.id);
            return res.status(404).json({ message: 'User not found' });
        }
        console.log('User found in DB, created_at:', result.rows[0].created_at);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userCheck = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, role, created_at',
            [name, email, hashedPassword]
        );

        const token = jwt.sign({ id: result.rows[0].id, role: result.rows[0].role }, process.env.JWT_SECRET);
        res.status(201).json({ user: result.rows[0], token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    console.log('Login attempt for email:', email);

    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            console.log('User not found in DB');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log('User found, role:', result.rows[0].role);
        const isMatch = await bcrypt.compare(password, result.rows[0].password);
        console.log('Password match:', isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: result.rows[0].id, role: result.rows[0].role }, process.env.JWT_SECRET);
        res.json({
            user: {
                id: result.rows[0].id,
                name: result.rows[0].name,
                email: result.rows[0].email,
                role: result.rows[0].role,
                created_at: result.rows[0].created_at
            },
            token
        });
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
