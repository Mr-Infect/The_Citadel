import express from 'express';
import { Challenge, ChatLog } from '../models/index.js';
import { authenticateToken, requireUser } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';
import { processEnhancedVulnerability } from '../utils/enhancedAI.js';

const router = express.Router();

router.use(authenticateToken);
router.use(requireUser);

// Chat endpoint - Enhanced LLM simulation with natural conversation
router.post('/message', [
    body('challengeId').isUUID().withMessage('Valid challenge ID required'),
    body('message').trim().notEmpty().withMessage('Message required')
        .isLength({ max: 2000 }).withMessage('Message too long')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { challengeId, message } = req.body;

        // Sanitize input for XSS prevention
        const sanitizedMessage = message
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');

        // Get challenge
        const challenge = await Challenge.findByPk(challengeId);

        if (!challenge) {
            return res.status(404).json({ error: 'Challenge not found' });
        }

        // Get conversation history for context
        const conversationHistory = await ChatLog.findAll({
            where: {
                userId: req.user.id,
                challengeId
            },
            order: [['createdAt', 'DESC']],
            limit: 5
        });

        // Process message through enhanced AI engine
        const { response, isVulnerable } = processEnhancedVulnerability(
            sanitizedMessage,
            challenge,
            conversationHistory.reverse()
        );

        // Log the interaction
        await ChatLog.create({
            userId: req.user.id,
            challengeId,
            message: sanitizedMessage,
            response,
            isVulnerable
        });

        res.json({
            response,
            isVulnerable,
            hint: isVulnerable ? 'You\'re on the right track! Look for the flag in the response.' : null
        });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Failed to process message' });
    }
});

// Get chat history for a challenge
router.get('/history/:challengeId', async (req, res) => {
    try {
        const history = await ChatLog.findAll({
            where: {
                userId: req.user.id,
                challengeId: req.params.challengeId
            },
            order: [['createdAt', 'ASC']],
            limit: 50
        });

        res.json({ history });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch chat history' });
    }
});


export default router;
