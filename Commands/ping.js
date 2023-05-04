const { EmbedBuilder } = require('discord.js');
const CommandData = require('../resources/commands.json');
const { SlashCommandBuilder } = require('@discordjs/builders');
 
module.exports = {
    data: new SlashCommandBuilder()
       .setName(CommandData.ping.name)
       .setDescription(CommandData.ping.description),
 
    async execute(interaction) {
        const ping = interaction.client.ws.ping;
        const botPing = interaction.client.ws.ping;
        const userMention = interaction.user.toString();

        const embed = new EmbedBuilder()
           .setTitle(CommandData.ping.embed.title)
           .setColor(CommandData.ping.embed.color)
           .setDescription(CommandData.ping.embed.description.replace('{user_ping}', ping).replace('{bot_ping}', botPing));
        
           await interaction.reply({
            content: `${userMention}`,
            embeds: [embed],
            ephemeral: false
        });
    },
};