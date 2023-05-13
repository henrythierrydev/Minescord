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
        .setName(lang.lock.slash.name)
        .setDescription(lang.lock.slash.description)
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
        
        channel.permissionOverwrites.edit(channel.guild.roles.everyone, { SendMessages: false });

        const successEmbed = new EmbedBuilder()
            .setTitle(lang.lock.embed.locked.title)
            .setDescription(lang.lock.embed.locked.description.replace('{author}', author))
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