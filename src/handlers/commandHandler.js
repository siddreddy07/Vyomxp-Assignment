import { Events } from 'discord.js';

export function setupCommandListener(client) {
  client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    console.log(`Interaction received: ${interaction}`);

    const command = interaction.client.commands.get(interaction.commandName);

    console.log(`Received command: ${interaction.commandName} from user: ${interaction.user.tag}`);

    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
    }
  });
}
