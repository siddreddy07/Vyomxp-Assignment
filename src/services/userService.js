import { User, Service } from '../models/index.js';

async function getUserWithServices(userId) {
  const user = await User.findByPk(userId, {
    include: [{ model: Service }],
    attributes: { exclude: ['password'] },
  });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return user;
}

export { getUserWithServices };
