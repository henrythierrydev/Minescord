const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const { getCommands } = require('../../Languages/controller');
const commands = getCommands();

// -------------------
//    COMMAND START
// -------------------

module.exports = 
{
    // -------------------
    //   COMMAND BUILDER
    // -------------------    

    data: new SlashCommandBuilder()
        .setName(commands.avatar.name)
        .setDescription(commands.avatar.description)
        
        .addUserOption(option =>
            option.setName(commands.avatar.slash_option.name)
            .setDescription(commands.avatar.slash_option.description)
        ),

    // -------------------
    //   COMMAND BUILDER
    // -------------------        

    async execute(interaction) 
    {
        const user = interaction.options.getUser(commands.avatar.slash_option.name) || interaction.user;
        const userAvatar = user.displayAvatarURL({ format: 'png', size: 2048 });
        const userMention = interaction.user.toString();
        const userName = user.username;

        // -------------------
        //    EMBED BUILDER
        // -------------------

        const embed = new EmbedBuilder()
            .setTitle(commands.avatar.embed.title)
            .setDescription(commands.avatar.embed.description.replace('{user_name}', userName))
            .setColor(commands.avatar.embed.color)
            .setImage(userAvatar)
            .setTimestamp();

            // -------------------
            //    BUTTON BUILDER
            // -------------------
            
            download = new ButtonBuilder()
                .setLabel(commands.avatar.embed.button.label)
                .setStyle(ButtonStyle.Link)
                .setURL(userAvatar)
                .setEmoji(commands.avatar.embed.button.emoji);
            
            // -------------------
            //    INTERACT BUILD
            // -------------------

            const row = new ActionRowBuilder().addComponents(download);

            // -------------------
            //    INTERACT SEND
            // -------------------            
            
            await interaction.reply({
                content: userMention,
                embeds: [embed],
                components: [row],
                ephemeral: false
            }
        );
    }
};