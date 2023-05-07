const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const { getTranslation } = require('../../languages/controller');
const lang = getTranslation(); 

module.exports = 
{
    // -------------------
    //    SLASH BUILDER
    // -------------------

    data: new SlashCommandBuilder()
        .setName(lang.ping.slash.name)
        .setDescription(lang.ping.slash.description),

    // -------------------
    //   COMMAND EXECUTE
    // -------------------

    async execute(interaction)
    {
        const gateway = interaction.client.ws.ping;
        const userMention = interaction.user.toString();
        const api = Date.now() - interaction.createdTimestamp;

        // -------------------
        //    EMBED BUILDER
        // -------------------
        
        const ping = new EmbedBuilder()
            .setTitle(lang.ping.embed.title)
            .setDescription(lang.ping.embed.description.replace('{gateway}', gateway).replace('{api}', api))
            .setColor(lang.ping.embed.color)
            .setTimestamp();
            
            await interaction.reply({
                content: userMention,
                embeds: [ping]
        });
    }
};