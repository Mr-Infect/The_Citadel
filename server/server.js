import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { sequelize, User } from './models/index.js';
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import userRoutes from './routes/user.routes.js';
import chatRoutes from './routes/chat.routes.js';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';

dotenv.config();

const app = express();

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);

    if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message });
    }

    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ error: 'Invalid token' });
    }

    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Database initialization and server start
const PORT = process.env.PORT || 5000;

async function initializeDatabase() {
    try {
        // Test connection
        await sequelize.authenticate();
        console.log('✓ Database connection established');

        // Sync models (in production, use migrations instead)
        await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
        console.log('✓ Database models synchronized');

        // Create default admin user if not exists
        const adminExists = await User.findOne({
            where: { username: process.env.ADMIN_USERNAME || 'admin' }
        });

        if (!adminExists) {
            await User.create({
                username: process.env.ADMIN_USERNAME || 'admin',
                email: 'admin@llmcyberrange.local',
                password: process.env.ADMIN_PASSWORD || 'Admin@123',
                role: 'admin'
            });
            console.log('✓ Default admin user created');
        }

        console.log('✓ Database initialization complete');
    } catch (error) {
        console.error('✗ Database initialization failed:', error);
        process.exit(1);
    }
}

// Start server
initializeDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`\n🚀 LLM Cyber Range Server running on port ${PORT}`);
        console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🔗 API: http://localhost:${PORT}/api`);
    });
});

export default app;
