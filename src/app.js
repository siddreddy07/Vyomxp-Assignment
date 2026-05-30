import express from 'express';
import { Client, GatewayIntentBits } from 'discord.js';
import config from './config/env.js';
import sequelize from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { setupCommandListener } from './handlers/commandHandler.js';
import * as ppcreateuser from './commands/utility/ppcreateuser.js';
import * as ppcreateservice from './commands/utility/ppcreateservice.js';
import * as ppgetuser from './commands/utility/ppgetuser.js';
const { PORT } = config;

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

try {
  await sequelize.authenticate();
  console.log('Database connected successfully.');
  await sequelize.sync();
  console.log('Database tables synced.');
} catch (error) {
  console.error('Database connection failed:', error.message);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Map();
client.commands.set(ppcreateuser.data.name, ppcreateuser);
client.commands.set(ppcreateservice.data.name, ppcreateservice);
client.commands.set(ppgetuser.data.name, ppgetuser);

setupCommandListener(client);

client.login(config.BOT_TOKEN);
