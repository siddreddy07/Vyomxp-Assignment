import sequelize from '../config/database.js';
import User from './User.model.js';
import Service from './Service.model.js';

User.hasMany(Service, { foreignKey: 'userId' });
Service.belongsTo(User, { foreignKey: 'userId' });

export { sequelize, User, Service };
