import { SlashCommandBuilder } from 'discord.js';
import { signup } from '../../services/auth.Service.js';

export const data = new SlashCommandBuilder()
  .setName('ppcreateuser')
  .setDescription('Create a new user account')
  .addStringOption(option =>
    option.setName('username')
      .setDescription('Desired username always lowercase')
      .setRequired(true))
  .addStringOption(option =>
    option.setName('email')
      .setDescription('Email address')
      .setRequired(true))
  .addStringOption(option =>
    option.setName('password')
      .setDescription('Password')
      .setRequired(true));

export async function execute(interaction) {
  const username = interaction.options.getString('username');
  const email = interaction.options.getString('email');
  const password = interaction.options.getString('password');

  await interaction.deferReply({ ephemeral: true });

  try {
    const result = await signup({ username: username.trim().toLowerCase(), password, email });
    await interaction.editReply({
      content: `User **${result.user.username}** created successfully! (ID: ${result.user.id})`,
    });
  } catch (err) {
    await interaction.editReply({
      content: `Failed to create user: ${err.message}`,
    });
  }
}
