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
        .setName(lang.removeRole.slash.name)
        .setDescription(lang.removeRole.slash.description)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        
        .addUserOption(option => option.setName(lang.universal.slash.user.name)
            .setDescription(lang.universal.slash.user.description)
            .setRequired(true)
        )

        .addRoleOption(option => option.setName(lang.universal.slash.role.name)
            .setDescription(lang.universal.slash.role.description)
            .setRequired(true)
        ),

    // -------------------
    //   COMMAND BUILDER
    // -------------------

    async execute(interaction) 
    {
        const user = interaction.options.getUser(lang.universal.slash.user.name);
        const role = interaction.options.getRole(lang.universal.slash.role.name);

        const member = interaction.guild.members.cache.get(user.id);

        const roleID = role.id;
        const mention = interaction.user.toString();
        const name = user.username;

        // -------------------
        //    COMMAND CHECK
        // -------------------

        if(!config.commands.remove_role) 
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
        //     BOT CHECK
        // -------------------

        if(user.bot)
        {
            const errorBotEmbed = new EmbedBuilder()
                .setTitle(lang.universal.embeds.bot.title)
                .setDescription(lang.universal.embeds.bot.description)
                .setColor("Red")
                .setTimestamp();
            
            return interaction.reply({
                content: mention,
                embeds: [errorBotEmbed],
                ephemeral: true
            });
        }

        // -------------------
        //     ROLE CHECK
        // -------------------

        if(!member.roles.cache.has(roleID))
        {
            const roleErrorEmbed = new EmbedBuilder()
                .setTitle(lang.removeRole.embed.nrole.title)
                .setDescription(lang.removeRole.embed.nrole.description)
                .setColor("Red")
                .setTimestamp();
                
            return interaction.reply({
                content: mention,
                embeds: [roleErrorEmbed],
                ephemeral: true
            });
        }

        // -------------------
        //      ROLE ADD
        // -------------------

        try {
            await member.roles.remove(roleID);
            
            // -------------------
            //     ROLE EMBED
            // -------------------

            const sucessEmbed = new EmbedBuilder()
                .setTitle(lang.removeRole.embed.roleremove.title)
                
                .setDescription(lang.removeRole.embed.roleremove.description
                    .replace('{user_name}', name)
                    .replace('{role_name}', role)
                )
                
                .setColor("Green")
                .setTimestamp();

            // -------------------
            //      ROLE SEND
            // -------------------                
        
            return interaction.reply({
                content: mention,
                embeds: [sucessEmbed],
                ephemeral: false
            });
        }

        catch(error)
        {
            // -------------------
            //    ERROR EMBED
            // -------------------

            const rolePermsEmbed = new EmbedBuilder()
                .setTitle(lang.universal.embeds.botperms.title)
                .setDescription(lang.universal.embeds.botperms.description)
                .setColor("Red")
                .setTimestamp();

            // -------------------
            //     ERROR SEND
            // -------------------                
                
            return interaction.reply({
                content: mention,
                embeds: [rolePermsEmbed],
                ephemeral: true
            });
        }
    }
};