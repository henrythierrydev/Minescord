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
        .setName(lang.kick.slash.name)
        .setDescription(lang.kick.slash.description)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        
        .addUserOption(option => option.setName(lang.universal.slash.user.name)
            .setDescription(lang.universal.slash.user.description)
            .setRequired(true)
        )

        .addStringOption(option => option.setName(lang.universal.slash.string.name)
            .setDescription(lang.universal.slash.string.description)
            .setRequired(true)
        ),

    // -------------------
    //   COMMAND EXECUTE
    // -------------------

    async execute(interaction)
    {
        const guild = interaction.guild;
        const ownerId = guild.ownerId;

        const author = interaction.user.username;
        const mention = interaction.user.toString();

        const user = interaction.options.getUser(lang.universal.slash.user.name);
        const reason = interaction.options.getString(lang.universal.slash.string.name);
        
        const member = interaction.guild.members.cache.get(user.id);
        const hasadmin = member.roles.cache.some(role => role.permissions.has(PermissionFlagsBits.Administrator));
        
        // -------------------
        //    COMMAND CHECK
        // -------------------

        if(!config.commands.kick) 
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
        //     LIMIT CHECK
        // -------------------

        if(reason.length < 10 || reason.length > 100) 
        {    
            const reasonErrorEmbed = new EmbedBuilder()
                .setTitle(lang.kick.embed.reason.title)
                .setDescription(lang.kick.embed.reason.description)
                .setColor("Yellow")
                .setTimestamp();
                
                return interaction.reply({
                    content: mention,
                    embeds: [reasonErrorEmbed],
                    ephemeral: true
                }
            );
        }

        // -------------------
        //      BOT CHECK
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
                }
            );
        }

        // -------------------
        //     ADMIN CHECK
        // -------------------

        if(hasadmin || user.id === ownerId) 
        {
            const errorAdminEmbed = new EmbedBuilder()
                .setTitle(lang.kick.embed.admin.title)
                .setDescription(lang.kick.embed.admin.description)
                .setColor("Yellow")
                .setTimestamp();
                
                return interaction.reply({
                    content: mention,
                    embeds: [errorAdminEmbed],
                    ephemeral: true
                }
            );
        }

        // -------------------
        //      KICK USER
        // -------------------

        try 
        {
            await interaction.guild.members.kick(user, { reason });
            
            // -------------------
            //     KICK EMBED
            // -------------------

            const successEmbed = new EmbedBuilder()
                .setTitle(lang.kick.embed.kicked.title)
                .setColor("Green")
                .setTimestamp()

                .setDescription(lang.kick.embed.kicked.description
                    .replace('{author_name}', author)
                    .replace('{victim}', user).replace('{reason}', reason)
                );

            // -------------------
            //      KICK SEND
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
    },
};