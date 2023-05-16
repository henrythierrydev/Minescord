const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const config = require('../../resources/config.json');
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
        const gateway = Math.round(interaction.client.ws.ping)
        const mention = interaction.user.toString();
        const api = Date.now() - interaction.createdTimestamp;

        // -------------------
        //    COMMAND CHECK
        // -------------------

        if(!config.commands.ping) 
        {
            const unavailableCommand = new EmbedBuilder()
                .setTitle(lang.universal.embeds.unavailable.title)
                .setDescription(lang.universal.embeds.unavailable.description)
                .setColor("Red")
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
            
            .setColor("Blue")
            .setTimestamp();

        // -------------------
        //     SEND EMBED
        // -------------------

        try
        {
            return interaction.reply({
                content: mention,
                embeds: [pingEmbed]
            });
        }

        catch(error)
        {
            // -------------------
            //   ERROR FEEDBACK
            // -------------------
        
            console.log(error);
            console.log("[Minescord] => [C] Critical => An unknown error occurred in the Ping command!");
            console.log("[Minescord] => [L] Log => Send the log to: https://github.com/Henry8K/Minescord");
        
            // -------------------
            //     ERROR EMBED
            // -------------------            
        
            const errorEmbed = new EmbedBuilder()
                .setTitle(lang.universal.embeds.broken.title)
                .setDescription(lang.universal.embeds.broken.description)
                .setColor("DarkRed")
                .setTimestamp();

            // -------------------
            //     ERROR SEND
            // -------------------                
                
            return interaction.reply({
                content: mention,
                embeds: [errorEmbed],
                ephemeral: true
            });
        }
    }
};