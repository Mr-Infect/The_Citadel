import express from 'express';
import { Op } from 'sequelize';
import { sequelize, User, Challenge, Progress } from '../models/index.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import multer from 'multer';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Configure multer for JSON file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/json') {
            cb(null, true);
        } else {
            cb(new Error('Only JSON files are allowed'));
        }
    }
});

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Get dashboard statistics
router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.count({ where: { role: 'user' } });
        const activeUsers = await User.count({
            where: {
                role: 'user',
                isActive: true
            }
        });

        const totalChallenges = await Challenge.count();

        // Get completion statistics
        const completedChallenges = await Progress.count({
            where: { status: 'completed' }
        });

        // Get user progress breakdown
        const userProgress = await Progress.findAll({
            attributes: [
                'userId',
                [sequelize.fn('COUNT', sequelize.col('id')), 'totalAttempts'],
                [sequelize.fn('SUM', sequelize.literal("CASE WHEN status = 'completed' THEN 1 ELSE 0 END")), 'completed']
            ],
            group: ['userId'],
            include: [{
                model: User,
                as: 'user',
                attributes: ['username', 'difficulty']
            }]
        });

        // Get difficulty distribution
        const difficultyStats = await User.findAll({
            attributes: [
                'difficulty',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            where: { role: 'user' },
            group: ['difficulty']
        });

        res.json({
            totalUsers,
            activeUsers,
            totalChallenges,
            completedChallenges,
            userProgress,
            difficultyStats
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// Upload vulnerabilities JSON
router.post('/upload-vulnerabilities', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const vulnerabilities = JSON.parse(req.file.buffer.toString());

        // Validate JSON structure
        if (!Array.isArray(vulnerabilities)) {
            return res.status(400).json({ error: 'JSON must be an array of vulnerabilities' });
        }

        const created = [];
        const errors = [];

        for (const vuln of vulnerabilities) {
            try {
                // Validate required fields
                if (!vuln.name || !vuln.description || !vuln.category || !vuln.difficulty || !vuln.flag || !vuln.promptLogic) {
                    errors.push({ vulnerability: vuln.name || 'Unknown', error: 'Missing required fields' });
                    continue;
                }

                const challenge = await Challenge.create({
                    name: vuln.name,
                    description: vuln.description,
                    category: vuln.category,
                    difficulty: vuln.difficulty,
                    order: vuln.order || 0,
                    flag: vuln.flag,
                    promptLogic: vuln.promptLogic,
                    hints: vuln.hints || [],
                    points: vuln.points || 100
                });

                created.push(challenge.name);
            } catch (error) {
                errors.push({ vulnerability: vuln.name, error: error.message });
            }
        }

        res.json({
            message: 'Upload processed',
            created: created.length,
            errors: errors.length,
            details: { created, errors }
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to process vulnerabilities file' });
    }
});

// Get all users with their progress
router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll({
            where: { role: 'user' },
            attributes: { exclude: ['password'] },
            include: [{
                model: Progress,
                as: 'progress',
                include: [{
                    model: Challenge,
                    as: 'challenge',
                    attributes: ['name', 'category', 'difficulty']
                }]
            }]
        });

        res.json({ users });
    } catch (error) {
        console.error('Users fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Manage challenges (CRUD)
router.get('/challenges', async (req, res) => {
    try {
        const challenges = await Challenge.findAll({
            order: [['difficulty', 'ASC'], ['order', 'ASC']]
        });
        res.json({ challenges });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch challenges' });
    }
});

router.delete('/challenges/:id', async (req, res) => {
    try {
        const challenge = await Challenge.findByPk(req.params.id);
        if (!challenge) {
            return res.status(404).json({ error: 'Challenge not found' });
        }

        await challenge.destroy();
        res.json({ message: 'Challenge deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete challenge' });
    }
});

export default router;
