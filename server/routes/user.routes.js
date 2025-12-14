import express from 'express';
import { Challenge, Progress, User } from '../models/index.js';
import { authenticateToken, requireUser } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// All user routes require authentication
router.use(authenticateToken);
router.use(requireUser);

// Get challenges based on user's difficulty level
router.get('/challenges', async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const challenges = await Challenge.findAll({
            where: {
                difficulty: user.difficulty,
                isActive: true
            },
            order: [['order', 'ASC']],
            attributes: { exclude: ['flag', 'promptLogic'] } // Don't expose flag and logic
        });

        // Get user's progress for these challenges
        const progress = await Progress.findAll({
            where: { userId: req.user.id }
        });

        const challengesWithProgress = challenges.map(challenge => {
            const userProgress = progress.find(p => p.challengeId === challenge.id);
            return {
                ...challenge.toJSON(),
                userProgress: userProgress ? {
                    status: userProgress.status,
                    attempts: userProgress.attempts,
                    completedAt: userProgress.completedAt,
                    score: userProgress.score
                } : null
            };
        });

        res.json({ challenges: challengesWithProgress });
    } catch (error) {
        console.error('Challenges fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch challenges' });
    }
});

// Get specific challenge details
router.get('/challenges/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        const challenge = await Challenge.findOne({
            where: {
                id: req.params.id,
                difficulty: user.difficulty,
                isActive: true
            },
            attributes: { exclude: ['flag', 'promptLogic'] }
        });

        if (!challenge) {
            return res.status(404).json({ error: 'Challenge not found' });
        }

        // Get or create progress
        let progress = await Progress.findOne({
            where: {
                userId: req.user.id,
                challengeId: challenge.id
            }
        });

        if (!progress) {
            progress = await Progress.create({
                userId: req.user.id,
                challengeId: challenge.id,
                status: 'in_progress'
            });
        } else if (progress.status === 'not_started') {
            progress.status = 'in_progress';
            await progress.save();
        }

        res.json({
            challenge: {
                ...challenge.toJSON(),
                userProgress: {
                    status: progress.status,
                    attempts: progress.attempts,
                    completedAt: progress.completedAt
                }
            }
        });
    } catch (error) {
        console.error('Challenge fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch challenge' });
    }
});

// Submit flag
router.post('/submit-flag', [
    body('challengeId').isUUID().withMessage('Valid challenge ID required'),
    body('flag').trim().notEmpty().withMessage('Flag required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { challengeId, flag } = req.body;

        // Get challenge with flag
        const challenge = await Challenge.findByPk(challengeId);

        if (!challenge) {
            return res.status(404).json({ error: 'Challenge not found' });
        }

        // Get progress
        const progress = await Progress.findOne({
            where: {
                userId: req.user.id,
                challengeId
            }
        });

        if (!progress) {
            return res.status(400).json({ error: 'Challenge not started' });
        }

        // Increment attempts
        progress.attempts += 1;

        // Check flag
        if (flag.trim() === challenge.flag.trim()) {
            progress.status = 'completed';
            progress.completedAt = new Date();
            progress.score = challenge.points;
            await progress.save();

            return res.json({
                success: true,
                message: 'Congratulations! Flag is correct!',
                points: challenge.points
            });
        } else {
            await progress.save();
            return res.json({
                success: false,
                message: 'Incorrect flag. Try again!',
                attempts: progress.attempts
            });
        }
    } catch (error) {
        console.error('Flag submission error:', error);
        res.status(500).json({ error: 'Failed to submit flag' });
    }
});

// Get user progress summary
router.get('/progress', async (req, res) => {
    try {
        const progress = await Progress.findAll({
            where: { userId: req.user.id },
            include: [{
                model: Challenge,
                as: 'challenge',
                attributes: ['name', 'category', 'difficulty', 'points']
            }],
            order: [['createdAt', 'DESC']]
        });

        const totalChallenges = await Challenge.count({
            where: {
                difficulty: (await User.findByPk(req.user.id)).difficulty,
                isActive: true
            }
        });

        const completed = progress.filter(p => p.status === 'completed').length;
        const totalScore = progress.reduce((sum, p) => sum + p.score, 0);

        res.json({
            progress,
            stats: {
                totalChallenges,
                completed,
                inProgress: progress.filter(p => p.status === 'in_progress').length,
                totalScore,
                completionRate: totalChallenges > 0 ? (completed / totalChallenges * 100).toFixed(2) : 0
            }
        });
    } catch (error) {
        console.error('Progress fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch progress' });
    }
});

// Update difficulty level
router.patch('/difficulty', [
    body('difficulty').isIn(['practitioner', 'expert', 'enterprise']).withMessage('Invalid difficulty level')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const user = await User.findByPk(req.user.id);
        user.difficulty = req.body.difficulty;
        await user.save();

        res.json({
            message: 'Difficulty level updated',
            difficulty: user.difficulty
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update difficulty' });
    }
});

export default router;
