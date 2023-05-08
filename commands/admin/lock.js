const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const { getTranslation } = require('../../languages/controller');
const lang = getTranslation(); 

module.exports =
{
    // -------------------
    //    SLASH BUILDER
    // -------------------

    data: new SlashCommandBuilder()
        .setName(lang.lock.slash.name)
        .setDescription(lang.lock.slash.description),

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
        //     PERMS CHECK
        // -------------------
        
        if(!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) 
        {
            permission = new EmbedBuilder()
                .setTitle(lang.universal.permission.title)
                .setDescription(lang.universal.permission.description)
                .setColor(lang.universal.permission.color)
                .setTimestamp();
            
                return interaction.reply({
                    content: mention,
                    embeds: [permission],
                    ephemeral: true
                }
            );
        }

        // -------------------
        //     LOCK CHECK
        // -------------------

        if(existingPermissions && existingPermissions.deny.has(PermissionFlagsBits.SendMessages))
        {
            error = new EmbedBuilder()
                .setTitle(lang.lock.embed.error.title)
                .setDescription(lang.lock.embed.error.description)
                .setColor(lang.lock.embed.error.color)
                .setTimestamp();

            return interaction.reply({
                content: mention,
                embeds: [error],
                ephemeral: true
            });
        }

        // -------------------
        //     SUCESS LOCK
        // -------------------        
        
        channel.permissionOverwrites.edit(channel.guild.roles.everyone, { SendMessages: false });

        sucess = new EmbedBuilder()
            .setTitle(lang.lock.embed.sucess.title)
            .setDescription(lang.lock.embed.sucess.description.replace('{author}', author))
            .setColor(lang.lock.embed.sucess.color)
            .setTimestamp();

        // -------------------
        //     SEND EMBED
        // -------------------

        return interaction.reply({
            content: mention,
            embeds: [sucess],
            ephemeral: false
        });
    },
};