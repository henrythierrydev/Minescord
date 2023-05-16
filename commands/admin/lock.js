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
        .setName(lang.lock.slash.name)
        .setDescription(lang.lock.slash.description)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    // -------------------
    //   COMMAND EXECUTE
    // -------------------

    async execute(interaction)
    {
        const author = interaction.user.username;
        const mention = interaction.user.toString();
        const channel = interaction.channel;

        const everyoneRole = interaction.guild.roles.everyone;
        const existingPermissions = channel.permissionOverwrites.resolve(everyoneRole.id);
        
        // -------------------
        //    COMMAND CHECK
        // -------------------

        if(!config.commands.lock) 
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
        //     LOCK CHECK
        // -------------------

        if(existingPermissions && existingPermissions.deny.has(PermissionFlagsBits.SendMessages))
        {
            const alreadyLockedEmbed = new EmbedBuilder()
                .setTitle(lang.lock.embed.alreadylocked.title)
                .setDescription(lang.lock.embed.alreadylocked.description)
                .setColor("Red")
                .setTimestamp();

            return interaction.reply({
                content: mention,
                embeds: [alreadyLockedEmbed],
                ephemeral: true
            });
        }

        // -------------------
        //     SUCESS LOCK
        // -------------------

        try 
        {
            await channel.permissionOverwrites.edit(channel.guild.roles.everyone, { SendMessages: false });

            // -------------------
            //     LOCK EMBED
            // -------------------

            const successEmbed = new EmbedBuilder()
                .setTitle(lang.lock.embed.locked.title)
                .setDescription(lang.lock.embed.locked.description.replace('{author}', author))
                .setColor("Green")
                .setTimestamp();

            // -------------------
            //      LOCK SEND
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
            console.log("[Minescord] => [C] Critical => An unknown error occurred in the Lock command!");
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