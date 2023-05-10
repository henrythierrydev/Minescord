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
                .setTitle(lang.universal.embeds.permission.title)
                .setDescription(lang.universal.embeds.permission.description)
                .setColor("Red")
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
        
        channel.permissionOverwrites.edit(channel.guild.roles.everyone, { SendMessages: true });

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
    },
};