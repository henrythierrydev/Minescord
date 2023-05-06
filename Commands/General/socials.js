const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const { getMessages, getCommands } = require('../../Languages/controller');
const { execute } = require('../Config/language');
const messages = getMessages();
const commands = getCommands();

// -------------------
//    COMMAND START
// -------------------

module.exports = {

    // -------------------
    //   COMMAND BUILDER
    // -------------------

    data: new SlashCommandBuilder()
        .setName(commands.socials.name)
        .setDescription(commands.socials.description),

    // -------------------
    //   COMMAND EXECUTE
    // -------------------

    async execute(interaction)
    {
        const userMention = interaction.user.toString();
        const authorAvatar = interaction.member.user.avatarURL();
        
        // -------------------
        //    EMBED BUILDER
        // -------------------
        
        const socialembed = new EmbedBuilder()
            .setTimestamp()
            .setTitle(commands.socials.embed.title)
            .setDescription(commands.socials.embed.description)
            .setColor(commands.socials.embed.color)
            .setThumbnail(commands.socials.embed.thumbnail)
    }

    
}