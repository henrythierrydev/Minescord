const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const { getTranslation } = require('../../languages/controller');
const lang = getTranslation(); 

const data = require('../../resources/about.json'); 

module.exports = 
{
    // -------------------
    //    SLASH BUILDER
    // -------------------

    data: new SlashCommandBuilder()
        .setName(lang.socials.slash.name)
        .setDescription(commands.socials.slash.description),

    // -------------------
    //   COMMAND EXECUTE
    // -------------------

    async execute(interaction)
    {
        const mention = interaction.user.toString();
        
        // -------------------
        //    EMBED BUILDER
        // -------------------
        
        const social = new EmbedBuilder()
            .setTimestamp()
            .setTitle(commands.socials.embed.title)
            .setDescription(commands.socials.embed.description)
            .setColor(commands.socials.embed.color);

        // -------------------
        //   BUTTON BUILDER
        // -------------------

        const row = new ActionRowBuilder();
        const socialsPlatforms = ['youtube', 'twitter', 'instagram', 'reddit', 'facebook'];

        for(const platform of socialsPlatforms) 
        {
            if(data.socials[platform].active)
            {
                const socials = new ButtonBuilder()
                    .setLabel(platform)
                    .setStyle(ButtonStyle.Link)
                    .setURL(data.socials[platform].link)
                    .setEmoji(data.socials[platform].emoji);

                row.addComponents(socials);
            }
        }

        const rows = [row];

        // -------------------
        //    EMBED SENDER
        // -------------------

        await interaction.reply({
            content: mention,
            embeds: [social],
            components: rows
        });
    }
};