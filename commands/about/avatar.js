const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const { getTranslation } = require('../../languages/controller');
const lang = getTranslation(); 

module.exports = 
{
    // -------------------
    //    SLASH BUILDER
    // -------------------

    data: new SlashCommandBuilder()
        .setName(lang.avatar.slash.name)
        .setDescription(lang.avatar.slash.description)
        
        .addUserOption(option => option.setName(lang.avatar.slash.option.name)
            .setDescription(lang.avatar.slash.option.description)
        ),

    // -------------------
    //   COMMAND BUILDER
    // -------------------

    async execute(interaction) 
    {
        const user = interaction.options.getUser(commands.avatar.slash.option.name) || interaction.user;
        const avatar = user.displayAvatarURL({ format: 'png', size: 2048 });
        const mention = interaction.user.toString();
        const name = user.username;

        // -------------------
        //    EMBED BUILDER
        // -------------------

        const embed = new EmbedBuilder()
            .setTitle(lang.avatar.embed.title)
            .setDescription(lang.avatar.embed.description.replace('{user_name}', name))
            .setColor(lang.avatar.embed.color)
            .setImage(avatar)
            .setTimestamp();

        // -------------------
        //   BUTTON BUILDER
        // -------------------
            
        download = new ButtonBuilder()
            .setLabel(lang.avatar.embed.button.label)
            .setStyle(ButtonStyle.Link)
            .setURL(userAvatar)
            .setEmoji(lang.avatar.embed.button.emoji);

            const modules = new ActionRowBuilder().addComponents(download);
            
            await interaction.reply({
                content: mention,
                embeds: [embed],
                components: [modules],
                ephemeral: false
            }
        );
    }
};