const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
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
        .setName(lang.unlock.slash.name)
        .setDescription(lang.unlock.slash.description)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

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
        //    UNLOCK CHECK
        // -------------------

        if(existingPermissions && existingPermissions.allow.has(PermissionFlagsBits.SendMessages))
        {
            const alreadyUnlockedEmbed = new EmbedBuilder()
                .setTitle(lang.unlock.embed.alreadyunlocked.title)
                .setDescription(lang.unlock.embed.alreadyunlocked.description)
                .setColor("Red")
                .setTimestamp();

            return interaction.reply({
                content: mention,
                embeds: [alreadyUnlockedEmbed],
                ephemeral: true
            });
        }

        // -------------------
        //    SUCESS UNLOCK
        // -------------------

        try 
        {
            await channel.permissionOverwrites.edit(channel.guild.roles.everyone, { SendMessages: true });

            const successEmbed = new EmbedBuilder()
                .setTitle(lang.unlock.embed.unlocked.title)
                .setDescription(lang.unlock.embed.unlocked.description.replace('{author}', author))
                .setColor("Green")
                .setTimestamp();
    
            // -------------------
            //     SEND EMBED
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
            //     ERRORS LOGS
            // -------------------
        
            console.log("[Minescord] => [C] Critical => An unknown error occurred in the unlock command!");
            console.log("[Minescord] => [L] Log => Send the log to: https://github.com/Henry8K/Minescord/issues");
        
            // -------------------
            //    ERRORS EMBED
            // -------------------            
        
            const errorEmbed = new EmbedBuilder()
                .setTitle(lang.universal.embeds.broken.title)
                .setDescription(lang.universal.embeds.broken.description)
                .setColor("DarkRed")
                .setTimestamp();
                
            return interaction.reply({
                content: mention,
                embeds: [errorEmbed],
                ephemeral: true
            });
        }
    },
};