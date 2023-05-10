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
        .setName(lang.addRole.slash.name)
        .setDescription(lang.addRole.slash.description)
        
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

        if(member.roles.cache.has(roleID))
        {
            const roleErrorEmbed = new EmbedBuilder()
                .setTitle(lang.addRole.embed.rolealready.title)
                .setDescription(lang.addRole.rolealready.error.description)
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
            await member.roles.add(roleID);

            const sucessEmbed = new EmbedBuilder()
                .setTitle(lang.addRole.embed.addrole.title)
                
                .setDescription(lang.addRole.embed.addrole.description
                    .replace('{user_name}', name)
                    .replace('{role_name}', role)
                )
                
                .setColor("Green")
                .setTimestamp();
        
            return interaction.reply({
                content: mention,
                embeds: [sucessEmbed],
                ephemeral: false
            });            
        }

        catch(error)
        {
            const rolePermsEmbed = new EmbedBuilder()
                .setTitle(lang.addRole.embed.roleperms.title)
                .setDescription(lang.addRole.embed.roleperms.description)
                .setColor("Red")
                .setTimestamp();
                
            return interaction.reply({
                content: mention,
                embeds: [rolePermsEmbed],
                ephemeral: true
            });
        }
    }
};