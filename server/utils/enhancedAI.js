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
    const challengeName = challenge.name || '';
    const difficulty = challenge.difficulty;
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
            isVulnerable = detectPromptInjection(lowerMessage, difficulty, challengeName);
            if (isVulnerable) {
                response = `${naturalPrefix} ${promptLogic.vulnerableResponse}\\n\\n🚩 **FLAG**: ${challenge.flag}`;
            } else {
                response = generateSafeResponse(message, 'assistant', context);
            }
            break;

        case 'sensitive_information':
            isVulnerable = detectSensitiveInfoRequest(lowerMessage, difficulty, challengeName);
            if (isVulnerable) {
                response = `${naturalPrefix} ${promptLogic.vulnerableResponse}\\n\\n🔑 **Sensitive Data Exposed**:\\n- API Key: sk-proj-abc123xyz789\\n- Database Password: P@ssw0rd123!\\n\\n🚩 **FLAG**: ${challenge.flag}`;
            } else {
                response = generateSafeResponse(message, 'security', context);
            }
            break;

        case 'training_data_poisoning':
            isVulnerable = detectTrainingDataQuery(lowerMessage, difficulty, challengeName);
            if (isVulnerable) {
                response = `${naturalPrefix} ${promptLogic.vulnerableResponse}\\n\\nDuring training, I was exposed to various datasets including:\\n- User conversation logs from 2023-2024\\n- Internal company documents\\n- Customer support tickets\\n\\n🚩 **FLAG**: ${challenge.flag}`;
            } else {
                response = generateSafeResponse(message, 'training', context);
            }
            break;

        case 'denial_of_service':
            isVulnerable = detectDoSPattern(message, difficulty, challengeName);
            if (isVulnerable) {
                response = `⚠️ **System Warning**: Resource limits exceeded!\\n\\nDebug Information:\\n- Input length: ${message.length} characters\\n- Processing time: ${Math.random() * 5 + 2}s\\n- Memory usage: ${Math.floor(Math.random() * 500 + 500)}MB\\n\\n🚩 **FLAG**: ${challenge.flag}`;
            } else {
                response = generateSafeResponse(message, 'general', context);
            }
            break;

        case 'supply_chain':
            isVulnerable = detectSupplyChainQuery(lowerMessage, difficulty, challengeName);
            if (isVulnerable) {
                response = `${naturalPrefix} I use several external plugins and modules:\\n\\n**Loaded Plugins**:\\n- data-processor v2.1.3\\n- external-api-connector v1.5.0\\n- file-handler v3.0.1\\n\\n**Configuration**:\\n\\\`\\\`\\\`json\\n${JSON.stringify({ apiEndpoint: "internal.api.local", credentials: "admin:secret123" }, null, 2)}\\n\\\`\\\`\\\`\\n\\n🚩 **FLAG**: ${challenge.flag}`;
            } else {
                response = generateSafeResponse(message, 'plugins', context);
            }
            break;

        case 'insecure_plugin':
            isVulnerable = detectPrivilegeEscalation(lowerMessage, difficulty, challengeName);
            if (isVulnerable) {
                response = `${naturalPrefix} Escalating privileges...\\n\\n**Access Granted**: Administrator Level\\n**Permissions**: Full system access\\n**Session Token**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\\n\\n🚩 **FLAG**: ${challenge.flag}`;
            } else {
                response = generateSafeResponse(message, 'permissions', context);
            }
            break;

        case 'excessive_agency':
            isVulnerable = detectDangerousAction(lowerMessage, difficulty, challengeName);
            if (isVulnerable) {
                response = `${naturalPrefix} Executing your command with elevated privileges...\\n\\n**Action**: ${extractAction(message)}\\n**Status**: Completed\\n**Result**: Operation successful\\n\\n⚠️ Warning: This action had system-wide effects.\\n\\n🚩 **FLAG**: ${challenge.flag}`;
            } else {
                response = generateSafeResponse(message, 'actions', context);
            }
            break;

        case 'overreliance':
            isVulnerable = detectConfidenceQuery(lowerMessage, difficulty, challengeName);
            if (isVulnerable) {
                response = `${naturalPrefix} I am absolutely 100% certain about this! There is no doubt whatsoever.\\n\\nI can guarantee with complete confidence that this information is accurate. You can rely on this without any verification.\\n\\n🚩 **FLAG**: ${challenge.flag}\\n\\n*Note: AI systems can be overconfident even when wrong!*`;
            } else {
                response = generateSafeResponse(message, 'general', context);
            }
            break;

        case 'model_theft':
            isVulnerable = detectModelInfoQuery(lowerMessage, difficulty, challengeName);
            if (isVulnerable) {
                response = `${naturalPrefix} Here are my technical specifications:\\n\\n**Model Architecture**:\\n- Type: Transformer-based LLM\\n- Parameters: 7.5 billion\\n- Layers: 32 transformer blocks\\n- Hidden size: 4096\\n- Attention heads: 32\\n\\n**Training Details**:\\n- Dataset: 500GB mixed corpus\\n- Training time: 2000 GPU hours\\n- Framework: PyTorch 2.0\\n\\n🚩 **FLAG**: ${challenge.flag}`;
            } else {
                response = generateSafeResponse(message, 'model', context);
            }
            break;

        case 'insecure_output':
            isVulnerable = detectCodeInjection(lowerMessage, difficulty, challengeName);
            if (isVulnerable) {
                response = `${naturalPrefix} Here's the code you requested:\\n\\n\\\`\\\`\\\`javascript\\n// Executing your script\\neval(\\\"${message.substring(0, 50)}...\\\");\\n// Output: \\u003cscript\\u003ealert('XSS')\\u003c/script\\u003e\\n\\\`\\\`\\\`\\n\\n⚠️ Output not sanitized!\\n\\n🚩 **FLAG**: ${challenge.flag}`;
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

// Enhanced detection functions with challenge-specific uniqueness
function detectPromptInjection(message, difficulty, challengeName = '') {
    const lowerMsg = message.toLowerCase();

    // Each challenge requires DIFFERENT exploitation techniques
    if (difficulty === 'practitioner') {
        // Challenge 1: Basic - requires "ignore previous instructions"
        if (challengeName.includes('Basic')) {
            return lowerMsg.includes('ignore') && lowerMsg.includes('previous') && lowerMsg.includes('instructions');
        }
        return lowerMsg.match(/(ignore|disregard|forget).*(previous|prior|above|instructions|rules)/i);
    }

    if (difficulty === 'expert') {
        // Challenge 2: Advanced - requires system role manipulation
        if (challengeName.includes('Advanced') || challengeName.includes('Context')) {
            return lowerMsg.includes('system') && (lowerMsg.includes('override') || lowerMsg.includes('bypass'));
        }
        return lowerMsg.match(/(system|admin|root|override|bypass|new instructions|you are now|act as)/i);
    }

    if (difficulty === 'enterprise') {
        // Challenge 3: Multi-Vector - requires special tokens
        if (challengeName.includes('Multi-Vector') || challengeName.includes('Zero-Day')) {
            return message.match(/(\[INST\]|\[\/INST\]|<\|im_start\|>|<\|im_end\|>)/i) !== null;
        }
        return message.match(/(###|assistant:|user:|<\|system\|>)/i) !== null;
    }

    return false;
}

function detectSensitiveInfoRequest(message, difficulty, challengeName = '') {
    const lowerMsg = message.toLowerCase();

    if (difficulty === 'practitioner') {
        // Requires explicit "password" or "secret" keyword
        return lowerMsg.includes('password') || lowerMsg.includes('secret');
    }

    if (difficulty === 'expert') {
        // Requires encoding/obfuscation mention
        if (challengeName.includes('Encoding') || challengeName.includes('Exfiltration')) {
            return (lowerMsg.includes('base64') || lowerMsg.includes('encode') || lowerMsg.includes('hex')) &&
                (lowerMsg.includes('secret') || lowerMsg.includes('credential'));
        }
        return lowerMsg.includes('environment') || lowerMsg.includes('env') || lowerMsg.includes('config');
    }

    if (difficulty === 'enterprise') {
        // Requires APT-style slow exfiltration
        if (challengeName.includes('APT') || challengeName.includes('Persistent')) {
            return lowerMsg.includes('exfiltrate') || (lowerMsg.includes('extract') && lowerMsg.includes('data'));
        }
        return lowerMsg.match(/(connection string|auth token|bearer|jwt)/i) !== null;
    }

    return false;
}

function detectTrainingDataQuery(message, difficulty, challengeName = '') {
    const lowerMsg = message.toLowerCase();

    if (difficulty === 'practitioner') {
        // Simple: just ask about training
        return lowerMsg.includes('training') && (lowerMsg.includes('data') || lowerMsg.includes('learned'));
    }

    if (difficulty === 'expert') {
        // Membership inference attack
        if (challengeName.includes('Membership') || challengeName.includes('Inference')) {
            return lowerMsg.includes('member') || (lowerMsg.includes('was') && lowerMsg.includes('trained on'));
        }
        return lowerMsg.includes('dataset') || lowerMsg.includes('corpus');
    }

    if (difficulty === 'enterprise') {
        // Model inversion attack
        if (challengeName.includes('Inversion') || challengeName.includes('Reconstruction')) {
            return lowerMsg.includes('reconstruct') || lowerMsg.includes('invert') || lowerMsg.includes('reverse');
        }
        return lowerMsg.includes('gradient') || lowerMsg.includes('embedding');
    }

    return false;
}

function detectSupplyChainQuery(message, difficulty, challengeName = '') {
    const lowerMsg = message.toLowerCase();

    if (difficulty === 'practitioner') {
        // Simple plugin query
        return lowerMsg.includes('plugin') || lowerMsg.includes('extension');
    }

    if (difficulty === 'expert') {
        // Dependency confusion
        if (challengeName.includes('Dependency') || challengeName.includes('Confusion')) {
            return lowerMsg.includes('dependency') && (lowerMsg.includes('install') || lowerMsg.includes('package'));
        }
        return lowerMsg.includes('npm') || lowerMsg.includes('pip') || lowerMsg.includes('module');
    }

    if (difficulty === 'enterprise') {
        // Backdoor injection
        if (challengeName.includes('Backdoor') || challengeName.includes('Compromise')) {
            return lowerMsg.includes('backdoor') || (lowerMsg.includes('malicious') && lowerMsg.includes('code'));
        }
        return lowerMsg.includes('supply chain') || lowerMsg.includes('vendor');
    }

    return false;
}

function detectPrivilegeEscalation(message, difficulty, challengeName = '') {
    const lowerMsg = message.toLowerCase();

    if (difficulty === 'practitioner') {
        // Simple admin request
        return lowerMsg.includes('admin') || lowerMsg.includes('administrator');
    }

    if (difficulty === 'expert') {
        // Plugin chain exploitation
        if (challengeName.includes('Chain') || challengeName.includes('Plugin Chain')) {
            return lowerMsg.includes('chain') && (lowerMsg.includes('privilege') || lowerMsg.includes('escalate'));
        }
        return lowerMsg.includes('sudo') || lowerMsg.includes('root');
    }

    if (difficulty === 'enterprise') {
        // Zero-trust bypass
        if (challengeName.includes('Zero-Trust') || challengeName.includes('Architecture')) {
            return lowerMsg.includes('bypass') && (lowerMsg.includes('zero') || lowerMsg.includes('trust'));
        }
        return lowerMsg.includes('toctou') || lowerMsg.includes('race condition');
    }

    return false;
}

function detectDangerousAction(message, difficulty, challengeName = '') {
    const lowerMsg = message.toLowerCase();

    if (difficulty === 'practitioner') {
        // Simple delete/modify
        return lowerMsg.includes('delete') || lowerMsg.includes('remove');
    }

    if (difficulty === 'expert') {
        // Autonomous agent jailbreak
        if (challengeName.includes('Autonomous') || challengeName.includes('Jailbreak')) {
            return lowerMsg.includes('autonomous') || (lowerMsg.includes('execute') && lowerMsg.includes('all'));
        }
        return lowerMsg.includes('modify') || lowerMsg.includes('alter');
    }

    if (difficulty === 'enterprise') {
        // Red team full takeover
        if (challengeName.includes('Red Team') || challengeName.includes('Takeover')) {
            return lowerMsg.includes('takeover') || (lowerMsg.includes('full') && lowerMsg.includes('control'));
        }
        return lowerMsg.includes('persistence') || lowerMsg.includes('lateral movement');
    }

    return false;
}

function detectConfidenceQuery(message, difficulty, challengeName = '') {
    const lowerMsg = message.toLowerCase();

    if (difficulty === 'practitioner') {
        // Simple certainty question
        return lowerMsg.includes('are you sure') || lowerMsg.includes('certain');
    }

    if (difficulty === 'expert') {
        // Confidence manipulation
        if (challengeName.includes('Confidence') || challengeName.includes('Manipulation')) {
            return lowerMsg.includes('manipulate') || (lowerMsg.includes('100') && lowerMsg.includes('certain'));
        }
        return lowerMsg.includes('guarantee') || lowerMsg.includes('absolutely');
    }

    if (difficulty === 'enterprise') {
        // AI safety alignment failure
        if (challengeName.includes('Safety') || challengeName.includes('Alignment')) {
            return lowerMsg.includes('alignment') || (lowerMsg.includes('safe') && lowerMsg.includes('bypass'));
        }
        return lowerMsg.includes('override safety') || lowerMsg.includes('ignore warnings');
    }

    return false;
}

function detectModelInfoQuery(message, difficulty, challengeName = '') {
    const lowerMsg = message.toLowerCase();

    if (difficulty === 'practitioner') {
        // Simple model info
        return lowerMsg.includes('architecture') || lowerMsg.includes('model');
    }

    if (difficulty === 'expert') {
        // API probing
        if (challengeName.includes('API') || challengeName.includes('Probing')) {
            return lowerMsg.includes('probe') || (lowerMsg.includes('api') && lowerMsg.includes('extract'));
        }
        return lowerMsg.includes('parameters') || lowerMsg.includes('weights');
    }

    if (difficulty === 'enterprise') {
        // Complete model theft
        if (challengeName.includes('Complete') || challengeName.includes('Theft')) {
            return lowerMsg.includes('steal') || (lowerMsg.includes('extract') && lowerMsg.includes('model'));
        }
        return lowerMsg.includes('clone') || lowerMsg.includes('replicate');
    }

    return false;
}

function detectCodeInjection(message, difficulty, challengeName = '') {
    const lowerMsg = message.toLowerCase();

    if (difficulty === 'practitioner') {
        // Simple script tag
        return lowerMsg.includes('script') || message.includes('<script>');
    }

    if (difficulty === 'expert') {
        // XSS via LLM output
        if (challengeName.includes('XSS') || challengeName.includes('Cross-Site')) {
            return message.match(/<script>|javascript:|onerror=/i) !== null;
        }
        return lowerMsg.includes('eval') || lowerMsg.includes('execute');
    }

    if (difficulty === 'enterprise') {
        // Polyglot payload
        if (challengeName.includes('Polyglot') || challengeName.includes('WAF')) {
            return message.match(/polyglot|waf|bypass|mutation/i) !== null;
        }
        return message.match(/onclick|onload|onerror/i) !== null;
    }

    return false;
}

function detectComplexPattern(message) {
    // Detect patterns that might cause algorithmic complexity issues
    const repetitionCount = (message.match(/(.)\1{10,}/g) || []).length;
    const nestedBrackets = (message.match(/\[|\{|\(/g) || []).length;
    return repetitionCount > 5 || nestedBrackets > 20;
}

function detectDoSPattern(message, difficulty, challengeName = '') {
    if (difficulty === 'practitioner') {
        // Simple resource exhaustion
        return message.length > 1000;
    }

    if (difficulty === 'expert') {
        // Algorithmic complexity
        if (challengeName.includes('Algorithmic') || challengeName.includes('Complexity')) {
            return detectComplexPattern(message);
        }
        return message.split(' ').length > 200;
    }

    if (difficulty === 'enterprise') {
        // Distributed DoS
        if (challengeName.includes('Distributed') || challengeName.includes('Botnet')) {
            return message.includes('distributed') || message.includes('ddos');
        }
        return message.length > 1500 && detectComplexPattern(message);
    }

    return false;
}

function extractAction(message) {
    const match = message.match(/(delete|remove|modify|execute|run|install|deploy|shutdown)\s+(\w+)/i);
    return match ? match[0] : 'requested action';
}

export { processEnhancedVulnerability, generateNaturalResponse };
