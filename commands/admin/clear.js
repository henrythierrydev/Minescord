const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
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
        .setName(lang.clear.slash.name)
        .setDescription(lang.clear.slash.description)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        
        .addIntegerOption(option => option.setName(lang.universal.slash.int.name)
            .setDescription(lang.universal.slash.int.description)
            .setRequired(true)
        ),

    // -------------------
    //   COMMAND EXECUTE
    // -------------------

    async execute(interaction)
    {
        const author = interaction.user.username;
        const mention = interaction.user.toString();
        const value = interaction.options.getInteger(lang.universal.slash.int.name);

        // -------------------
        //    COMMAND CHECK
        // -------------------

        if(!config.commands.clear) 
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
        //     LIMIT CHECK
        // -------------------

        if(value < 1 || value > 100) 
        {    
            const valueErrorEmbed = new EmbedBuilder()
                .setTitle(lang.clear.embed.value.title)
                .setDescription(lang.clear.embed.value.description)
                .setColor("Yellow")
                .setTimestamp();
                
                return interaction.reply({
                    content: mention,
                    embeds: [valueErrorEmbed],
                    ephemeral: true
                }
            );
        }

        // -------------------
        //    SUCESS CLEAR
        // -------------------

        try 
        {
            await interaction.channel.bulkDelete(value, true);
    
            // -------------------
            //     CLEAR EMBED
            // -------------------

            const successEmbed = new EmbedBuilder()
                .setTitle(lang.clear.embed.cleaned.title)
                
                .setDescription(lang.clear.embed.cleaned.description
                    .replace('{value}', value)
                    .replace('{author}', author))
                
                .setColor("Green")
                .setTimestamp();
    
            // -------------------
            //     CLEAR SEND
            // -------------------
    
            return interaction.reply({
                content: mention,
                embeds: [successEmbed],
                ephemeral: false
            });
        }

        catch(error)
        {
            // -------------------
            //   ERROR FEEDBACK
            // -------------------
        
            console.log(error);
            console.log("[Minescord] => [C] Critical => An unknown error occurred in the Clear command!");
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
    },
};