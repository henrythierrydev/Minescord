const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandData = require('../resources/commands.json');

module.exports = {
    data: new SlashCommandBuilder()
       .setName(CommandData.ping.name)
       .setDescription(CommandData.ping.description),
 
    async execute(interaction) {
       const embed = new EmbedBuilder()
          .setTitle(CommandData.ping.embed.title)
          .setDescription(CommandData.ping.embed.description.replace('{user_ping}', `${Date.now() - interaction.createdTimestamp}`))
          .setColor(CommandData.ping.embed.color);
 
       await interaction.reply({
          embeds: [embed]
       });
    },
};