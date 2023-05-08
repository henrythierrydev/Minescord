const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const { getTranslation } = require('../../languages/controller');
const lang = getTranslation(); 

const data = require('../../resources/socials.json'); 

module.exports = 
{
    // -------------------
    //    SLASH BUILDER
    // -------------------

    data: new SlashCommandBuilder()
        .setName(lang.socials.slash.name)
        .setDescription(lang.socials.slash.description),

    // -------------------
    //   COMMAND EXECUTE
    // -------------------

    async execute(interaction)
    {
        const row = new ActionRowBuilder();
        const mention = interaction.user.toString();
        const socialsPlatforms = ['youtube', 'twitter', 'instagram', 'reddit', 'facebook'];
        
        // -------------------
        //    EMBED BUILDER
        // -------------------
        
        const social = new EmbedBuilder()
            .setTimestamp()
            .setTitle(lang.socials.embed.title)
            .setDescription(lang.socials.embed.description)
            .setColor(lang.socials.embed.color)
            .setImage(lang.socials.embed.banner);

        // -------------------
        //   BUTTON BUILDER
        // -------------------

        for(const platform of socialsPlatforms) 
        {
            if(data.socials[platform].active)
            {
                const socials = new ButtonBuilder()
                    .setLabel(platform.charAt(0).toUpperCase() + platform.slice(1))
                    .setStyle(ButtonStyle.Link)
                    .setURL(data.socials[platform].link)
                    .setEmoji(data.socials[platform].emoji);

                row.addComponents(socials);
            }
        }
    
        const rows = [row];

        // -------------------
        //     SEND EMBED
        // -------------------

        await interaction.reply({
            content: mention,
            embeds: [social],
            components: rows,
            ephemeral: false
        });
    }
};