import sequelize from '../config/database.js';
import User from './User.js';
import Service from './Service.js';

User.hasMany(Service, { foreignKey: 'userId' });
Service.belongsTo(User, { foreignKey: 'userId' });

export { sequelize, User, Service };
