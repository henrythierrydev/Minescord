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
        .setName(lang.removeRole.slash.name)
        .setDescription(lang.removeRole.slash.description)
        
        .addUserOption(option => option.setName(lang.removeRole.slash.option.user.name)
            .setDescription(lang.removeRole.slash.option.user.description)
            .setRequired(true)
        )

        .addRoleOption(option => option.setName(lang.removeRole.slash.option.role.name)
            .setDescription(lang.removeRole.slash.option.role.description)
            .setRequired(true)
        ),

    // -------------------
    //   COMMAND BUILDER
    // -------------------

    async execute(interaction) 
    {
        const user = interaction.options.getUser(lang.removeRole.slash.option.user.name);
        const role = interaction.options.getRole(lang.removeRole.slash.option.role.name);

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
                .setTitle(lang.universal.permission.title)
                .setDescription(lang.universal.permission.description)
                .setColor(lang.universal.permission.color)
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
                .setTitle(lang.universal.bot.title)
                .setDescription(lang.universal.bot.description)
                .setColor(lang.universal.bot.color)
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
                .setTitle(lang.removeRole.embed.error.title)
                .setDescription(lang.removeRole.embed.error.description)
                .setColor(lang.removeRole.embed.error.color)
                .setTimestamp();
                
            return interaction.reply({
                content: mention,
                embeds: [roleErrorEmbed],
                ephemeral: true
            });
        }

        // -------------------
        //     ROLE REMOVE
        // -------------------

        await member.roles.remove(roleID);

        const sucessEmbed = new EmbedBuilder()
            .setTitle(lang.removeRole.embed.sucess.title)
            
            .setDescription(lang.removeRole.embed.sucess.description
                .replace('{user_name}', name)
                .replace('{role_name}', role)
            )
            
            .setColor(lang.removeRole.embed.sucess.color)
            .setTimestamp();
    
        return interaction.reply({
            content: mention,
            embeds: [sucessEmbed],
            ephemeral: false
        });
    }
};