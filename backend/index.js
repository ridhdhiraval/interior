const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const db = require('./db');

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Interior Design API' });
});

// Import and use routes
const authRoutes = require('./routes/auth');
const designRoutes = require('./routes/designs');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');

app.use('/api/auth', authRoutes);
app.use('/api/designs', designRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/contact', require('./routes/contact'));

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something broke!' });
});

app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    try {
        const res = await db.query('SELECT NOW()');
        console.log('Database connected successfully:', res.rows[0].now);
    } catch (err) {
        console.error('Database connection failed:', err.message);
    }
});
