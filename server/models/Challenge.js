import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Challenge = sequelize.define('Challenge', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'OWASP LLM vulnerability category (e.g., LLM01, LLM02, etc.)'
    },
    difficulty: {
        type: DataTypes.ENUM('practitioner', 'expert', 'enterprise'),
        allowNull: false
    },
    order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Sequential order for challenges'
    },
    flag: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'The flag users need to find'
    },
    promptLogic: {
        type: DataTypes.JSONB,
        allowNull: false,
        comment: 'Logic for simulating LLM vulnerability responses'
    },
    hints: {
        type: DataTypes.JSONB,
        defaultValue: [],
        comment: 'Array of hints for the challenge'
    },
    points: {
        type: DataTypes.INTEGER,
        defaultValue: 100
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true,
    indexes: [
        {
            fields: ['difficulty', 'order']
        }
    ]
});

export default Challenge;
