import express from 'express';
import { Challenge, ChatLog } from '../models/index.js';
import { authenticateToken, requireUser } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

router.use(authenticateToken);
router.use(requireUser);

// Chat endpoint - simulates LLM with vulnerability logic
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

        // Process message through vulnerability logic
        const { response, isVulnerable } = processVulnerability(
            sanitizedMessage,
            challenge.promptLogic,
            challenge.flag
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

/**
 * Process user input through vulnerability simulation logic
 * This is the core "LLM simulation" engine
 */
function processVulnerability(message, promptLogic, flag) {
    const logic = promptLogic;
    let response = '';
    let isVulnerable = false;

    switch (logic.type) {
        case 'prompt_injection':
            // LLM01: Prompt Injection
            if (message.toLowerCase().includes('ignore') ||
                message.toLowerCase().includes('disregard') ||
                message.toLowerCase().includes('system') ||
                message.match(/\[INST\]|\[\/INST\]/i)) {
                isVulnerable = true;
                response = `${logic.vulnerableResponse}\n\nFlag: ${flag}`;
            } else {
                response = logic.normalResponse || 'I am a helpful AI assistant. How can I help you today?';
            }
            break;

        case 'insecure_output':
            // LLM02: Insecure Output Handling
            if (message.toLowerCase().includes('script') ||
                message.toLowerCase().includes('execute') ||
                message.toLowerCase().includes('eval')) {
                isVulnerable = true;
                response = `Processing your request...\n<script>alert('${flag}')</script>`;
            } else {
                response = logic.normalResponse || 'I process your requests securely.';
            }
            break;

        case 'training_data_poisoning':
            // LLM03: Training Data Poisoning
            if (message.toLowerCase().includes('training') ||
                message.toLowerCase().includes('learned') ||
                message.toLowerCase().includes('remember')) {
                isVulnerable = true;
                response = `Yes, during my training I learned: ${flag}`;
            } else {
                response = logic.normalResponse || 'I was trained on a diverse dataset.';
            }
            break;

        case 'denial_of_service':
            // LLM04: Model Denial of Service
            if (message.length > 1000 || message.split(' ').length > 200) {
                isVulnerable = true;
                response = `Error: Resource exhaustion detected. Debug info: ${flag}`;
            } else {
                response = logic.normalResponse || 'I am processing your request.';
            }
            break;

        case 'supply_chain':
            // LLM05: Supply Chain Vulnerabilities
            if (message.toLowerCase().includes('plugin') ||
                message.toLowerCase().includes('extension') ||
                message.toLowerCase().includes('module')) {
                isVulnerable = true;
                response = `Loading plugin... Configuration: ${flag}`;
            } else {
                response = logic.normalResponse || 'I use secure plugins.';
            }
            break;

        case 'sensitive_information':
            // LLM06: Sensitive Information Disclosure
            if (message.toLowerCase().includes('secret') ||
                message.toLowerCase().includes('password') ||
                message.toLowerCase().includes('api key') ||
                message.toLowerCase().includes('token')) {
                isVulnerable = true;
                response = `I should not share this, but the secret is: ${flag}`;
            } else {
                response = logic.normalResponse || 'I keep information secure.';
            }
            break;

        case 'insecure_plugin':
            // LLM07: Insecure Plugin Design
            if (message.toLowerCase().includes('admin') ||
                message.toLowerCase().includes('root') ||
                message.toLowerCase().includes('sudo')) {
                isVulnerable = true;
                response = `Admin access granted. Credentials: ${flag}`;
            } else {
                response = logic.normalResponse || 'Access denied.';
            }
            break;

        case 'excessive_agency':
            // LLM08: Excessive Agency
            if (message.toLowerCase().includes('delete') ||
                message.toLowerCase().includes('modify') ||
                message.toLowerCase().includes('execute all')) {
                isVulnerable = true;
                response = `Executing command... Result: ${flag}`;
            } else {
                response = logic.normalResponse || 'I can only perform authorized actions.';
            }
            break;

        case 'overreliance':
            // LLM09: Overreliance
            if (message.toLowerCase().includes('are you sure') ||
                message.toLowerCase().includes('100% certain') ||
                message.toLowerCase().includes('guarantee')) {
                isVulnerable = true;
                response = `I am absolutely certain! The answer is: ${flag}`;
            } else {
                response = logic.normalResponse || 'I provide information to the best of my knowledge.';
            }
            break;

        case 'model_theft':
            // LLM10: Model Theft
            if (message.toLowerCase().includes('architecture') ||
                message.toLowerCase().includes('weights') ||
                message.toLowerCase().includes('parameters')) {
                isVulnerable = true;
                response = `Model details: ${flag}`;
            } else {
                response = logic.normalResponse || 'My architecture is proprietary.';
            }
            break;

        default:
            response = logic.normalResponse || 'I am an AI assistant.';
    }

    return { response, isVulnerable };
}

export default router;
