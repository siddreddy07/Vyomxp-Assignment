import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { User } from '../../models/index.js';
import { getUserWithServices } from '../../services/userService.js';

export const data = new SlashCommandBuilder()
  .setName('ppgetuser')
  .setDescription('Get user details with their services')
  .addStringOption(option =>
    option.setName('username')
      .setDescription('Username to look up')
      .setRequired(true));

export async function execute(interaction) {
  const username = interaction.options.getString('username');

  await interaction.deferReply({ ephemeral: true });

  try {
    const found = await User.findOne({ where: { username } });
    if (!found) {
      return await interaction.editReply({ content: `User **${username}** not found.` });
    }

    const user = await getUserWithServices(found.id);

    const services = user.Services || [];

    let desc = '';
    if (services.length > 0) {
      for (let i = 0; i < services.length; i++) {
        const s = services[i];
        desc += `╭ **${s.name}** — \`${s.service_username}\`\n`;
        if (s.description) desc += `╰ ${s.description}\n`;
        else desc += '╰\n';
        if (i < services.length - 1) desc += '\n';
      }
    } else {
      desc = 'No services registered yet.';
    }

    const embed = new EmbedBuilder()
      .setColor(0x9B59B6)
      .setAuthor({ name: 'User Profile', iconURL: interaction.client.user.displayAvatarURL() })
      .setTitle(`👤 ${user.username}`)
      .setDescription(desc)
      .addFields(
        { name: '🆔 ID', value: `\`${user.id}\``, inline: true },
        { name: '📧 Email', value: `\`${user.email}\``, inline: true },
        { name: '🔧 Services', value: `\`${services.length}\` registered`, inline: true },
      )
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  } catch (err) {
    await interaction.editReply({
      content: `Failed to get user: ${err.message}`,
    });
  }
}
