const { EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const config = require('../../resources/config.json');
const { getTranslation } = require('../../languages/controller');
const lang = getTranslation(); 

const fs = require('fs');
const path = require('path');
const dataPath = path.resolve(__dirname, '../../resources/data/ticket.json');
const data = require(dataPath);

module.exports = 
{
    // -------------------
    //    SLASH BUILDER
    // -------------------

    data: new SlashCommandBuilder()
        .setName(lang.setTicket.slash.name)
        .setDescription(lang.setTicket.slash.description)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

        .addChannelOption(option => option.setName(lang.universal.slash.channel.name)
            .setDescription(lang.universal.slash.channel.description)
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )

        .addChannelOption(option => option.setName(lang.universal.slash.category.name)
            .setDescription(lang.universal.slash.category.description)
            .addChannelTypes(ChannelType.GuildCategory)
            .setRequired(true)
        ),

    // -------------------
    //   COMMAND BUILDER
    // -------------------

    async execute(interaction) 
    {
        const mention = interaction.user.toString();
        const channel = interaction.options.getChannel(lang.universal.slash.channel.name);
        const category = interaction.options.getChannel(lang.universal.slash.category.name);

        // -------------------
        //    COMMAND CHECK
        // -------------------

        if(!config.commands.ticket) 
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
        //     SET VALUES
        // -------------------

        try 
        {
            data.tickets.ticket_channel = channel.id;
            data.tickets.ticket_category = category.id;
            fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
            
            // -------------------
            //    EMBED BUILDER
            // -------------------
        
            const setTicketEmbed = new EmbedBuilder()
                .setTitle(lang.setTicket.embed.title)
                .setDescription(lang.setTicket.embed.description.replace('{ticket_channel}', channel))
                .setColor("Green")
                .setTimestamp();
            
            // -------------------
            //     SEND EMBED
            // -------------------            

            return interaction.reply({
                content: mention,
                embeds: [setTicketEmbed],
                ephemeral: true
            });
        }

        catch(error)
        {
            // -------------------
            //   ERROR FEEDBACK
            // -------------------
        
            console.log(error);
            console.log("[Minescord] => [C] Critical => An unknown error occurred in the Set ticket command!");
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