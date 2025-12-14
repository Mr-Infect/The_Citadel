import sequelize from '../config/database.js';
import User from './User.js';
import Challenge from './Challenge.js';
import Progress from './Progress.js';
import ChatLog from './ChatLog.js';

// Define associations
User.hasMany(Progress, { foreignKey: 'userId', as: 'progress' });
Progress.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Challenge.hasMany(Progress, { foreignKey: 'challengeId', as: 'progress' });
Progress.belongsTo(Challenge, { foreignKey: 'challengeId', as: 'challenge' });

User.hasMany(ChatLog, { foreignKey: 'userId', as: 'chatLogs' });
ChatLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Challenge.hasMany(ChatLog, { foreignKey: 'challengeId', as: 'chatLogs' });
ChatLog.belongsTo(Challenge, { foreignKey: 'challengeId', as: 'challenge' });

export { sequelize, User, Challenge, Progress, ChatLog };
