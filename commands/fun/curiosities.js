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
        .setName(lang.curiosities.slash.name)
        .setDescription(lang.curiosities.slash.description),

    // -------------------
    //   COMMAND BUILDER
    // -------------------

    async execute(interaction) 
    {
        const mention = interaction.user.toString();

        // -------------------
        //    COMMAND CHECK
        // -------------------

        if(!commands.curiosities) 
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
        //     CURIOSITIES
        // -------------------

        const curiosities = Object.values(lang.curiosities.array);

        const randomIndex = Math.floor(Math.random() * curiosities.length);
        const curiosity = curiosities[randomIndex];
        
        // -------------------
        //    EMBED BUILDER
        // -------------------
        
        const curiositiesEmbed = new EmbedBuilder()
            .setTitle(lang.curiosities.embed.title)
            .setDescription(lang.curiosities.embed.description.replace('{curiosity}', curiosity))
            .setColor("Blue")
            .setTimestamp();

        // -------------------
        //     SEND EMBED
        // -------------------

        await interaction.reply({
            content: mention,
            embeds: [curiositiesEmbed],
            ephemeral: false
        });
    }
};