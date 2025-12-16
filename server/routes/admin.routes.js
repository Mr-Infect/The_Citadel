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

        // Get user progress breakdown with proper raw query
        const userProgressRaw = await sequelize.query(`
            SELECT 
                u.id as "userId",
                u.username,
                u.difficulty,
                COUNT(p.id) as "totalAttempts",
                SUM(CASE WHEN p.status = 'completed' THEN 1 ELSE 0 END) as completed,
                SUM(CASE WHEN p.status = 'completed' THEN p.score ELSE 0 END) as "totalScore"
            FROM "Users" u
            LEFT JOIN "Progresses" p ON u.id = p."userId"
            WHERE u.role = 'user'
            GROUP BY u.id, u.username, u.difficulty
            ORDER BY "totalScore" DESC
        `, { type: sequelize.QueryTypes.SELECT });

        // Get difficulty distribution
        const difficultyStatsRaw = await sequelize.query(`
            SELECT 
                difficulty,
                COUNT(*) as count
            FROM "Users"
            WHERE role = 'user'
            GROUP BY difficulty
        `, { type: sequelize.QueryTypes.SELECT });

        res.json({
            totalUsers,
            activeUsers,
            totalChallenges,
            completedChallenges,
            userProgress: userProgressRaw,
            difficultyStats: difficultyStatsRaw
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

// Get prompt engineering attack logs
router.get('/attack-logs', async (req, res) => {
    try {
        const { userId, challengeId, limit = 100 } = req.query;

        const whereClause = {};
        if (userId) whereClause.userId = userId;
        if (challengeId) whereClause.challengeId = challengeId;

        // Fetch chat logs with vulnerability attempts
        const attackLogs = await sequelize.query(`
            SELECT 
                cl.id,
                cl.message as "attackPrompt",
                cl.response,
                cl."isVulnerable" as "exploitSuccessful",
                cl."createdAt",
                u.username,
                u.difficulty as "userDifficulty",
                c.name as "challengeName",
                c.category,
                c.difficulty as "challengeDifficulty"
            FROM "ChatLogs" cl
            JOIN "Users" u ON cl."userId" = u.id
            JOIN "Challenges" c ON cl."challengeId" = c.id
            ${userId ? `WHERE cl."userId" = '${userId}'` : ''}
            ${challengeId ? `${userId ? 'AND' : 'WHERE'} cl."challengeId" = '${challengeId}'` : ''}
            ORDER BY cl."createdAt" DESC
            LIMIT ${parseInt(limit)}
        `, { type: sequelize.QueryTypes.SELECT });

        // Analyze attack patterns
        const attackPatterns = await sequelize.query(`
            SELECT 
                u.username,
                u.difficulty,
                COUNT(*) as "totalAttempts",
                SUM(CASE WHEN cl."isVulnerable" = true THEN 1 ELSE 0 END) as "successfulExploits",
                ROUND(
                    (SUM(CASE WHEN cl."isVulnerable" = true THEN 1 ELSE 0 END)::numeric / 
                    NULLIF(COUNT(*)::numeric, 0) * 100), 2
                ) as "successRate"
            FROM "ChatLogs" cl
            JOIN "Users" u ON cl."userId" = u.id
            GROUP BY u.id, u.username, u.difficulty
            ORDER BY "successfulExploits" DESC
        `, { type: sequelize.QueryTypes.SELECT });

        res.json({
            attackLogs,
            attackPatterns,
            total: attackLogs.length
        });
    } catch (error) {
        console.error('Attack logs error:', error);
        res.status(500).json({ error: 'Failed to fetch attack logs' });
    }
});

export default router;
