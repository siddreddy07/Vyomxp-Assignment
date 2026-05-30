import 'dotenv/config';

export default {
  PORT: process.env.PORT || 8080,
  JWT_SECRET: process.env.JWT_SECRET || 'vyom-exo-jwt-secret-dev',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  BOT_TOKEN: process.env.BOT_TOKEN,
  CLIENT_ID: process.env.CLIENT_ID,
};
