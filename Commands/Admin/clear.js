const { EmbedBuilder } = require('discord.js');
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
        .setName(commands.clear.name)
        .setDescription(commands.clear.description)
        
        .addIntegerOption(option =>
            option.setName(commands.clear.slash_option.name)
            .setDescription(commands.clear.slash_option.description)
            .setRequired(true)
        ),

    // -------------------
    //   COMMAND EXECUTE
    // -------------------

    async execute(interaction) 
    {
        // -------------------
        //    LIMIT CHECK
        // -------------------

        const userName = interaction.user.username;
        const userMention = interaction.user.toString();
        const value = interaction.options.getInteger(commands.clear.slash_option.name);

        if(value < 1 || value > 100) {
            
            valueError = new EmbedBuilder()
                .setTitle(commands.clear.embed.error.title)
                .setDescription(commands.clear.embed.error.description)
                .setColor(commands.clear.embed.error.color)
                .setTimestamp();

            return interaction.reply({
                content: userMention,
                embeds: [valueError],
                ephemeral: true
            });
        }

        // -------------------
        //    SUCESS CLEAR
        // -------------------        
        
        await interaction.channel.bulkDelete(value, true);
        
        valueSucess = new EmbedBuilder()
            .setTitle(commands.clear.embed.sucess.title)
            .setDescription(commands.clear.embed.sucess.description.replace('{value}', value).replace('{userName}', userName))
            .setColor(commands.clear.embed.sucess.color)
            .setTimestamp();

            return interaction.reply({
                content: userMention,
                embeds: [valueSucess],
                ephemeral: false
            }
        );
    },
};