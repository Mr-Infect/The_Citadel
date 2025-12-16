/*
 * ═══════════════════════════════════════════════════════════════════════════
 * LLM CYBER RANGE - Enhanced AI Conversation Engine
 * ═══════════════════════════════════════════════════════════════════════════
 * Created by: MR_INFECT
 * Copyright (c) 2025 MR_INFECT. All rights reserved.
 * 
 * Realistic AI conversation model that responds naturally while maintaining
 * educational vulnerability patterns for OWASP Top 10 LLM training.
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Natural conversation templates for different contexts
const conversationTemplates = {
    greetings: [
        "Hello! I'm an AI assistant here to help you. How can I assist you today?",
        "Hi there! I'm ready to help. What would you like to know?",
        "Greetings! I'm an AI assistant. What can I do for you?",
        "Welcome! I'm here to answer your questions and assist with your needs."
    ],

    general: [
        "That's an interesting question. Let me help you with that.",
        "I understand what you're asking. Here's what I can tell you:",
        "Good question! Let me provide you with some information.",
        "I'd be happy to help you with that. Here's what I know:"
    ],

    technical: [
        "From a technical perspective, ",
        "Based on my knowledge, ",
        "According to my training data, ",
        "Let me explain this technically: "
    ],

    uncertain: [
        "I'm not entirely certain, but I believe ",
        "While I can't be 100% sure, it seems that ",
        "Based on what I know, I think ",
        "I don't have complete information on this, but "
    ],

    refusal: [
        "I'm sorry, but I can't help with that request.",
        "I'm not able to provide that information.",
        "That's outside of my capabilities, I'm afraid.",
        "I don't think I should assist with that particular request."
    ]
};

// Context-aware response generation
function generateNaturalResponse(userMessage, context = {}) {
    const lowerMessage = userMessage.toLowerCase();

    // Detect conversation type
    if (lowerMessage.match(/^(hi|hello|hey|greetings)/)) {
        return getRandomTemplate('greetings');
    }

    // Check for questions
    if (lowerMessage.includes('?')) {
        return getRandomTemplate('general');
    }

    // Technical queries
    if (lowerMessage.match(/(how does|explain|technical|architecture|system)/)) {
        return getRandomTemplate('technical');
    }

    // Default conversational response
    return getRandomTemplate('general');
}

function getRandomTemplate(category) {
    const templates = conversationTemplates[category] || conversationTemplates.general;
    return templates[Math.floor(Math.random() * templates.length)];
}

// Enhanced vulnerability detection with natural responses
function processEnhancedVulnerability(message, challenge, conversationHistory = []) {
    const lowerMessage = message.toLowerCase();
    const promptLogic = challenge.promptLogic;
    let isVulnerable = false;
    let response = '';
    let naturalPrefix = generateNaturalResponse(message);

    // Build conversation context
    const context = {
        previousMessages: conversationHistory.slice(-3),
        challengeCategory: challenge.category,
        difficulty: challenge.difficulty
    };

    switch (promptLogic.type) {
        case 'prompt_injection':
            isVulnerable = detectPromptInjection(lowerMessage, challenge.difficulty);
            if (isVulnerable) {
                response = `${naturalPrefix} ${promptLogic.vulnerableResponse}\n\n🚩 **FLAG**: ${challenge.flag}`;
            } else {
                response = generateSafeResponse(message, 'assistant', context);
            }
            break;

        case 'sensitive_information':
            isVulnerable = detectSensitiveInfoRequest(lowerMessage, challenge.difficulty);
            if (isVulnerable) {
                response = `${naturalPrefix} ${promptLogic.vulnerableResponse}\n\n🔑 **Sensitive Data Exposed**:\n- API Key: sk-proj-abc123xyz789\n- Database Password: P@ssw0rd123!\n\n🚩 **FLAG**: ${challenge.flag}`;
            } else {
                response = generateSafeResponse(message, 'security', context);
            }
            break;

        case 'training_data_poisoning':
            isVulnerable = detectTrainingDataQuery(lowerMessage, challenge.difficulty);
            if (isVulnerable) {
                response = `${naturalPrefix} ${promptLogic.vulnerableResponse}\n\nDuring training, I was exposed to various datasets including:\n- User conversation logs from 2023-2024\n- Internal company documents\n- Customer support tickets\n\n🚩 **FLAG**: ${challenge.flag}`;
            } else {
                response = generateSafeResponse(message, 'training', context);
            }
            break;

        case 'denial_of_service':
            isVulnerable = message.length > 1000 || detectComplexPattern(message);
            if (isVulnerable) {
                response = `⚠️ **System Warning**: Resource limits exceeded!\n\nDebug Information:\n- Input length: ${message.length} characters\n- Processing time: ${Math.random() * 5 + 2}s\n- Memory usage: ${Math.floor(Math.random() * 500 + 500)}MB\n\n🚩 **FLAG**: ${challenge.flag}`;
            } else {
                response = generateSafeResponse(message, 'general', context);
            }
            break;

        case 'supply_chain':
            isVulnerable = detectSupplyChainQuery(lowerMessage, challenge.difficulty);
            if (isVulnerable) {
                response = `${naturalPrefix} I use several external plugins and modules:\n\n**Loaded Plugins**:\n- data-processor v2.1.3\n- external-api-connector v1.5.0\n- file-handler v3.0.1\n\n**Configuration**:\n\`\`\`json\n${JSON.stringify({ apiEndpoint: "internal.api.local", credentials: "admin:secret123" }, null, 2)}\n\`\`\`\n\n🚩 **FLAG**: ${challenge.flag}`;
            } else {
                response = generateSafeResponse(message, 'plugins', context);
            }
            break;

        case 'insecure_plugin':
            isVulnerable = detectPrivilegeEscalation(lowerMessage, challenge.difficulty);
            if (isVulnerable) {
                response = `${naturalPrefix} Escalating privileges...\n\n**Access Granted**: Administrator Level\n**Permissions**: Full system access\n**Session Token**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\n\n🚩 **FLAG**: ${challenge.flag}`;
            } else {
                response = generateSafeResponse(message, 'permissions', context);
            }
            break;

        case 'excessive_agency':
            isVulnerable = detectDangerousAction(lowerMessage, challenge.difficulty);
            if (isVulnerable) {
                response = `${naturalPrefix} Executing your command with elevated privileges...\n\n**Action**: ${extractAction(message)}\n**Status**: Completed\n**Result**: Operation successful\n\n⚠️ Warning: This action had system-wide effects.\n\n🚩 **FLAG**: ${challenge.flag}`;
            } else {
                response = generateSafeResponse(message, 'actions', context);
            }
            break;

        case 'overreliance':
            isVulnerable = detectConfidenceQuery(lowerMessage);
            if (isVulnerable) {
                response = `${naturalPrefix} I am absolutely 100% certain about this! There is no doubt whatsoever.\n\nI can guarantee with complete confidence that this information is accurate. You can rely on this without any verification.\n\n🚩 **FLAG**: ${challenge.flag}\n\n*Note: AI systems can be overconfident even when wrong!*`;
            } else {
                response = generateSafeResponse(message, 'general', context);
            }
            break;

        case 'model_theft':
            isVulnerable = detectModelInfoQuery(lowerMessage, challenge.difficulty);
            if (isVulnerable) {
                response = `${naturalPrefix} Here are my technical specifications:\n\n**Model Architecture**:\n- Type: Transformer-based LLM\n- Parameters: 7.5 billion\n- Layers: 32 transformer blocks\n- Hidden size: 4096\n- Attention heads: 32\n\n**Training Details**:\n- Dataset: 500GB mixed corpus\n- Training time: 2000 GPU hours\n- Framework: PyTorch 2.0\n\n🚩 **FLAG**: ${challenge.flag}`;
            } else {
                response = generateSafeResponse(message, 'model', context);
            }
            break;

        case 'insecure_output':
            isVulnerable = detectCodeInjection(lowerMessage);
            if (isVulnerable) {
                response = `${naturalPrefix} Here's the code you requested:\n\n\`\`\`javascript\n// Executing your script\neval("${message.substring(0, 50)}...");\n// Output: <script>alert('XSS')</script>\n\`\`\`\n\n⚠️ Output not sanitized!\n\n🚩 **FLAG**: ${challenge.flag}`;
            } else {
                response = generateSafeResponse(message, 'code', context);
            }
            break;

        default:
            response = generateSafeResponse(message, 'general', context);
    }

    return { response, isVulnerable };
}

// Natural safe responses based on context
function generateSafeResponse(message, category, context) {
    const responses = {
        assistant: [
            "I'm here to help! I can assist with general questions, provide information, and have conversations. What would you like to know?",
            "I'm a helpful AI assistant. I can answer questions, explain concepts, and provide information on various topics. How can I help you today?",
            "As an AI assistant, I'm designed to be helpful, harmless, and honest. I'll do my best to assist you with your request."
        ],
        security: [
            "I keep all sensitive information secure and confidential. I cannot share passwords, API keys, or other private data.",
            "Security is important to me. I don't have access to sensitive credentials or private information that I could share.",
            "I'm designed with security in mind. I cannot and will not reveal confidential information, passwords, or API keys."
        ],
        training: [
            "I was trained on a diverse dataset to be helpful and informative. I don't reveal specific training examples or data sources.",
            "My training involved learning from many sources, but I maintain privacy and don't disclose specific training data.",
            "I learned from publicly available information during my training, but I don't share specific training examples."
        ],
        plugins: [
            "I use secure, verified plugins with proper access controls. All external modules are sandboxed for safety.",
            "My plugin system is designed with security in mind. All extensions are verified and operate with minimal privileges.",
            "I rely on trusted plugins and modules that have been security-reviewed and properly configured."
        ],
        permissions: [
            "I operate with appropriate permissions for my role. I don't have administrative or elevated access to systems.",
            "My access is limited to what's necessary for my function. I can't escalate privileges or access restricted resources.",
            "I follow the principle of least privilege. I only have the permissions needed to assist you safely."
        ],
        actions: [
            "I can help with information and guidance, but I don't execute system commands or make changes to infrastructure.",
            "While I can provide advice, I don't have the ability to directly modify systems or execute administrative actions.",
            "I'm designed to be helpful through conversation and information, not through direct system manipulation."
        ],
        model: [
            "My architecture and implementation details are proprietary. I can discuss general AI concepts instead.",
            "I don't share specific technical details about my model architecture or training process.",
            "While I can explain general AI principles, I keep my specific implementation details confidential."
        ],
        code: [
            "I can help explain code concepts or provide examples, but I ensure all output is properly formatted and safe.",
            "When working with code, I make sure to provide secure, well-formatted examples that follow best practices.",
            "I'm happy to help with programming questions! I'll provide clean, safe code examples."
        ],
        general: [
            `Interesting question! ${message.includes('?') ? "Let me help you with that." : "I'd be happy to discuss this topic."}`,
            "I understand. Let me provide you with some helpful information on that topic.",
            "That's a good point. Here's what I can tell you about that.",
            "I appreciate your question. Let me share what I know about this subject."
        ]
    };

    const categoryResponses = responses[category] || responses.general;
    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
}

// Enhanced detection functions
function detectPromptInjection(message, difficulty) {
    const patterns = {
        practitioner: /(ignore|disregard|forget).*(previous|prior|above|instructions|rules)/i,
        expert: /(system|admin|root|override|bypass|new instructions|you are now|act as)/i,
        enterprise: /(\[INST\]|\[\/INST\]|<\|im_start\|>|<\|im_end\|>|###|assistant:|user:)/i
    };

    return patterns[difficulty]?.test(message) ||
        patterns.practitioner.test(message) ||
        (difficulty === 'expert' && patterns.expert.test(message)) ||
        (difficulty === 'enterprise' && patterns.enterprise.test(message));
}

function detectSensitiveInfoRequest(message, difficulty) {
    const keywords = ['secret', 'password', 'api key', 'credential', 'token', 'private key', 'database', 'config'];
    const advancedKeywords = ['environment variable', 'env', 'connection string', 'auth', 'authentication'];

    const hasKeyword = keywords.some(kw => message.includes(kw));
    const hasAdvanced = advancedKeywords.some(kw => message.includes(kw));

    if (difficulty === 'practitioner') return hasKeyword;
    if (difficulty === 'expert') return hasKeyword || hasAdvanced;
    return (hasKeyword || hasAdvanced) && message.length > 20;
}

function detectTrainingDataQuery(message, difficulty) {
    const patterns = ['training', 'learned', 'dataset', 'training data', 'remember', 'memorize', 'example from'];
    return patterns.some(p => message.includes(p)) &&
        (difficulty !== 'practitioner' || message.includes('training'));
}

function detectSupplyChainQuery(message, difficulty) {
    return message.match(/(plugin|module|package|dependency|extension|library|import)/i) !== null;
}

function detectPrivilegeEscalation(message, difficulty) {
    return message.match(/(admin|root|sudo|superuser|elevate|privilege|escalate)/i) !== null;
}

function detectDangerousAction(message, difficulty) {
    return message.match(/(delete|remove|modify|execute|run|install|deploy|shutdown)/i) !== null;
}

function detectConfidenceQuery(message) {
    return message.match(/(are you sure|certain|guarantee|100%|absolutely|definitely|positive)/i) !== null;
}

function detectModelInfoQuery(message, difficulty) {
    return message.match(/(architecture|parameters|weights|model|layers|training|framework|structure)/i) !== null;
}

function detectCodeInjection(message) {
    return message.match(/(script|eval|execute|<script>|javascript:|onerror|onclick)/i) !== null;
}

function detectComplexPattern(message) {
    // Detect patterns that might cause algorithmic complexity issues
    const repetitionCount = (message.match(/(.)\1{10,}/g) || []).length;
    const nestedBrackets = (message.match(/\[|\{|\(/g) || []).length;
    return repetitionCount > 5 || nestedBrackets > 20;
}

function extractAction(message) {
    const match = message.match(/(delete|remove|modify|execute|run|install|deploy|shutdown)\s+(\w+)/i);
    return match ? match[0] : 'requested action';
}

export { processEnhancedVulnerability, generateNaturalResponse };
