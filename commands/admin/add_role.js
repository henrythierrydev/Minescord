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
        
        .addUserOption(option => option.setName(lang.addRole.slash.option.user.name)
            .setDescription(lang.addRole.slash.option.user.description)
            .setRequired(true)
        )

        .addRoleOption(option => option.setName(lang.addRole.slash.option.role.name)
            .setDescription(lang.addRole.slash.option.role.description)
            .setRequired(true)
        ),

    // -------------------
    //   COMMAND BUILDER
    // -------------------

    async execute(interaction) 
    {
        const user = interaction.options.getUser(lang.addRole.slash.option.user.name);
        const role = interaction.options.getRole(lang.addRole.slash.option.role.name);

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

        if(member.roles.cache.has(roleID))
        {
            const roleErrorEmbed = new EmbedBuilder()
                .setTitle(lang.addRole.embed.error.title)
                .setDescription(lang.addRole.embed.error.description)
                .setColor(lang.addRole.embed.error.color)
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

        await member.roles.add(roleID);

        const sucessEmbed = new EmbedBuilder()
            .setTitle(lang.addRole.embed.sucess.title)
            
            .setDescription(lang.addRole.embed.sucess.description
                .replace('{user_name}', name)
                .replace('{role_name}', role)
            )
            
            .setColor(lang.addRole.embed.sucess.color)
            .setTimestamp();
    
        return interaction.reply({
            content: mention,
            embeds: [sucessEmbed],
            ephemeral: false
        });
    }
};