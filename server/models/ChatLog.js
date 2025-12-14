import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ChatLog = sequelize.define('ChatLog', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    challengeId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Challenges',
            key: 'id'
        }
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    response: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    isVulnerable: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Whether this interaction exploited a vulnerability'
    }
}, {
    timestamps: true,
    indexes: [
        {
            fields: ['userId', 'challengeId']
        }
    ]
});

export default ChatLog;
