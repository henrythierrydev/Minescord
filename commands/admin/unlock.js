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
        .setName(lang.unlock.slash.name)
        .setDescription(lang.unlock.slash.description),

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
            const permissionEmbed = new EmbedBuilder()
                .setTitle(lang.universal.permission.title)
                .setDescription(lang.universal.permission.description)
                .setColor(lang.universal.permission.color)
                .setTimestamp();
            
                return interaction.reply({
                    content: mention,
                    embeds: [permissionEmbed],
                    ephemeral: true
                }
            );
        }

        // -------------------
        //    UNLOCK CHECK
        // -------------------

        if(existingPermissions && existingPermissions.allow.has(PermissionFlagsBits.SendMessages))
        {
            const errorEmbed = new EmbedBuilder()
                .setTitle(lang.unlock.embed.error.title)
                .setDescription(lang.unlock.embed.error.description)
                .setColor(lang.unlock.embed.error.color)
                .setTimestamp();

            return interaction.reply({
                content: mention,
                embeds: [errorEmbed],
                ephemeral: true
            });
        }

        // -------------------
        //    SUCESS UNLOCK
        // -------------------
        
        channel.permissionOverwrites.edit(channel.guild.roles.everyone, { SendMessages: true });

        const successEmbed = new EmbedBuilder()
            .setTitle(lang.unlock.embed.success.title)
            .setDescription(lang.unlock.embed.success.description.replace('{author}', author))
            .setColor(lang.unlock.embed.success.color)
            .setTimestamp();

        // -------------------
        //     SEND EMBED
        // -------------------

        return interaction.reply({
            content: mention,
            embeds: [successEmbed],
            ephemeral: false
        });
    },
};