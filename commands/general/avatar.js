const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const { getTranslation } = require('../../languages/controller');
const lang = getTranslation(); 

const commands = require('../../resources/commands.json');

module.exports = 
{
    // -------------------
    //    SLASH BUILDER
    // -------------------

    data: new SlashCommandBuilder()
        .setName(lang.avatar.slash.name)
        .setDescription(lang.avatar.slash.description)
        
        .addUserOption(option => option.setName(lang.universal.slash.user.name)
            .setDescription(lang.universal.slash.user.description)
            .setRequired(true)
        ),

    // -------------------
    //   COMMAND BUILDER
    // -------------------

    async execute(interaction) 
    {
        const user = interaction.options.getUser(lang.universal.slash.user.name);
        const avatar = user.displayAvatarURL({ format: 'png', size: 2048 });
        
        const mention = interaction.user.toString();
        const name = user.username;

        // -------------------
        //    COMMAND CHECK
        // -------------------

        if(!commands.ip) 
        {
            const unavailableCommand = new EmbedBuilder()
                .setTitle(lang.universal.embeds.unavailable.title)
                .setColor("Red")
                .setDescription(lang.universal.embeds.unavailable.description)
                .setTimestamp();
            
            return interaction.reply({
                content: mention,
                embeds: [unavailableCommand],
                ephemeral: true
            });
        }        

        // -------------------
        //    EMBED BUILDER
        // -------------------

        const avatarEmbed = new EmbedBuilder()
            .setTitle(lang.avatar.embed.title.replace('{user_name}', name))
            .setDescription(lang.avatar.embed.description.replace('{user_name}', name))
            .setColor("Orange")
            .setImage(avatar)
            .setTimestamp();

        // -------------------
        //   BUTTON BUILDER
        // -------------------
            
        const downloadButton = new ButtonBuilder()
            .setLabel(lang.avatar.embed.button.label)
            .setStyle(ButtonStyle.Link)
            .setURL(avatar)
            .setEmoji(lang.avatar.embed.button.emoji);

        const modules = new ActionRowBuilder().addComponents(downloadButton);
            
        // -------------------
        //     SEND EMBED
        // -------------------

        try
        {
            return interaction.reply({
                content: mention,
                embeds: [avatarEmbed],
                components: [modules],
                ephemeral: false
            });
        }

        catch(error)
        {
            // -------------------
            //     ERRORS LOGS
            // -------------------
        
            console.log("[Minescord] => [C] Critical => An unknown error occurred in the avatar command!");
            console.log("[Minescord] => [L] Log => Send the log to: https://github.com/Henry8K/Minescord/issues");
        
            // -------------------
            //    ERRORS EMBED
            // -------------------            
        
            const errorEmbed = new EmbedBuilder()
                .setTitle(lang.universal.embeds.broken.title)
                .setDescription(lang.universal.embeds.broken.description)
                .setColor("DarkRed")
                .setTimestamp();
                
            return interaction.reply({
                content: mention,
                embeds: [errorEmbed],
                ephemeral: true
            });
        }
    }
};