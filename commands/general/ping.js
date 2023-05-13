const { EmbedBuilder } = require('discord.js');
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
        .setName(lang.ping.slash.name)
        .setDescription(lang.ping.slash.description),

    // -------------------
    //   COMMAND EXECUTE
    // -------------------

    async execute(interaction)
    {
        const gateway = (interaction.client.ws.ping);
        const mention = interaction.user.toString();
        const api = (Date.now() - interaction.createdTimestamp);

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
        
        const pingEmbed = new EmbedBuilder()
            .setTitle(lang.ping.embed.title)
            
            .setDescription(lang.ping.embed.description
                .replace('{gateway}', gateway)
                .replace('{api}', api))
            
            .setColor("Gold")
            .setTimestamp();

        // -------------------
        //     SEND EMBED
        // -------------------

        await interaction.reply({
            content: mention,
            embeds: [pingEmbed]
        });
    }
};