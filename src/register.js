import { REST, Routes } from 'discord.js';
import config from './config/env.js';
import * as ppcreateuser from './commands/utility/ppcreateuser.js';
import * as ppcreateservice from './commands/utility/ppcreateservice.js';
import * as ppgetuser from './commands/utility/ppgetuser.js';

const rest = new REST({ version: '10' }).setToken(config.BOT_TOKEN);

const commands = [
  ppcreateuser.data.toJSON(),
  ppcreateservice.data.toJSON(),
  ppgetuser.data.toJSON(),
];

try {
  await rest.put(
    Routes.applicationCommands(config.CLIENT_ID),
    { body: commands },
  );
  console.log('Slash commands registered with Discord.');
} catch (error) {
  console.error('Failed to register commands:', error);
}
