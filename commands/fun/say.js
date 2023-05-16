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
        .setName(lang.say.slash.name)
        .setDescription(lang.say.slash.description)

        .addStringOption(option => option.setName(lang.say.slash.string.name)
            .setDescription(lang.say.slash.string.description)
            .setRequired(true)
        ),

    // -------------------
    //   COMMAND BUILDER
    // -------------------

    async execute(interaction) 
    {
        const name = interaction.user.username;
        const mention = interaction.user.toString();
        const text = interaction.options.getString(lang.say.slash.string.name);

        // -------------------
        //    COMMAND CHECK
        // -------------------

        if(!config.commands.say) 
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
        //     LIMIT CHECK
        // -------------------

        if(text.length < 10 || text.length > 200) 
        {    
            const reasonErrorEmbed = new EmbedBuilder()
                .setTitle(lang.say.embed.limit.title)
                .setDescription(lang.say.embed.limit.description)
                .setColor("Yellow")
                .setTimestamp();
                
                return interaction.reply({
                    content: mention,
                    embeds: [reasonErrorEmbed],
                    ephemeral: true
                }
            );
        }

        // -------------------
        //    EMBED BUILDER
        // -------------------
        
        const sayEmbed = new EmbedBuilder()
            .setTitle(lang.say.embed.text.title.replace('{user_name}', name))
            .setDescription(lang.say.embed.text.description.replace('{text}', text))
            .setColor("Blue")
            .setTimestamp();

        // -------------------
        //    SEND MESSAGE
        // -------------------

        try
        {
            return interaction.reply({
                content: mention,
                embeds: [sayEmbed]
            });
        }

        catch(error)
        {
            // -------------------
            //   ERROR FEEDBACK
            // -------------------
        
            console.log(error);
            console.log("[Minescord] => [C] Critical => An unknown error occurred in the Say command!");
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