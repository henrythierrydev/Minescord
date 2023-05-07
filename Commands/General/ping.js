const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const { getCommands } = require('../../Languages/controller');
const commands = getCommands(); 

// -------------------
//    COMMAND START
// -------------------

module.exports = {

    // -------------------
    //   COMMAND BUILDER
    // -------------------

    data: new SlashCommandBuilder()
        .setName(commands.ping.name)
        .setDescription(commands.ping.description),

    // -------------------
    //   COMMAND EXECUTE
    // -------------------

    async execute(interaction)
    {
        const userMention = interaction.user.toString();
        const gatewayPing = interaction.client.ws.ping;
        const apiPing = Date.now() - interaction.createdTimestamp;
        const authorAvatar = interaction.user.displayAvatarURL({ dynamic: true });

        // -------------------
        //    EMBED BUILDER
        // -------------------
        
        const socialembed = new EmbedBuilder()
            .setTimestamp()
            .setTitle(commands.ping.embed.title)
            .setDescription(commands.ping.embed.description.replace('{gatewayPing}', gatewayPing).replace('{apiPing}', apiPing))
            .setColor(commands.ping.embed.color)
            .setThumbnail(authorAvatar);

        // -------------------
        //    EMBED SENDER
        // -------------------

        await interaction.reply({
            content: userMention,
            embeds: [socialembed]
        });
    }
}