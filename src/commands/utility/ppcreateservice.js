import { SlashCommandBuilder } from 'discord.js';
import { User, Service } from '../../models/index.js';

export const data = new SlashCommandBuilder()
  .setName('ppcreateservice')
  .setDescription('Create a new service for a user')
  .addStringOption(option =>
    option.setName('username')
      .setDescription('Username the service belongs to')
      .setRequired(true))
  .addStringOption(option =>
    option.setName('service_name')
      .setDescription('Service name')
      .setRequired(true))
  .addStringOption(option =>
    option.setName('service_username')
      .setDescription('Optional for Discord services.')
      .setRequired(false))
  .addStringOption(option =>
    option.setName('description')
      .setDescription('Service description')
      .setRequired(false));

export async function execute(interaction) {
  const username = interaction.options.getString('username');
  const name = interaction.options.getString('service_name');
  const serviceUsername = interaction.options.getString('service_username') || interaction.user.tag;
  const description = interaction.options.getString('description');

  await interaction.deferReply({ ephemeral: true });

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return await interaction.editReply({ content: `User **${username}** not found.` });
    }

    const service = await Service.create({
      name,
      description: description || null,
      service_username: serviceUsername,
      userId: user.id,
    });

    await interaction.editReply({
      content: `Service **${service.name}** created for **${username}**! (ServiceID: ${service.id})`,
    });
  } catch (err) {
    await interaction.editReply({
      content: `Failed to create service: ${err.message}`,
    });
  }
}
