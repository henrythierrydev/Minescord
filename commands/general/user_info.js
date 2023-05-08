const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType  } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const { getTranslation } = require('../../languages/controller');
const lang = getTranslation();

const config = require('../../resources/config.json');
const usersData = require('../../database/users.json');
const cooldownsData = require('../../database/cooldowns.json');

module.exports = 
{
    // -------------------
    //    SLASH BUILDER
    // -------------------

    data: new SlashCommandBuilder()
        .setName(lang.userInfo.slash.name)
        .setDescription(lang.userInfo.slash.description)

        .addUserOption(option => option.setName(lang.userInfo.slash.option.name)
            .setDescription(lang.userInfo.slash.option.description)
            .setRequired(true)
        ),

    // -------------------
    //   COMMAND BUILDER
    // -------------------

    async execute(interaction) 
    {
        const user = interaction.options.getUser(lang.userInfo.slash.option.name);
        const member = interaction.guild.members.cache.get(user.id);
        
        const userID = user.id;
        const userName = user.username;
        const userTag = user.tag;
        
        const mention = interaction.user.toString();
        const joinedDate = member.joinedAt.toLocaleDateString('en');
        const avatar = user.displayAvatarURL();
        
        // -------------------
        //     BOT VERIFY
        // -------------------
        
        if(user.bot)
        {
            const botError = new EmbedBuilder()
                .setTitle(lang.userInfo.embed.error.bot.title)
                .setColor(lang.userInfo.embed.error.bot.color)
                .setDescription(lang.userInfo.embed.error.bot.description)
                .setTimestamp();
                
                return interaction.reply({
                    content: mention,
                    embeds: [botError],
                    ephemeral: true
                }
            );
        }

        // -------------------
        //    EMBED BUILDER
        // -------------------

        const embed = new EmbedBuilder()
            .setTitle(lang.userInfo.embed.title)
            .setColor(lang.userInfo.embed.color)
            .setThumbnail(avatar)

            .addFields(
                { name: lang.userInfo.embed.field1, value: "`" + userTag + "`" },
                { name: lang.userInfo.embed.field2, value: "`" + userName + "`" },
                { name: lang.userInfo.embed.field3, value: "`" + userID + "`"},
                { name: lang.userInfo.embed.field4, value: "`" + joinedDate + "`"}
            )

            .setTimestamp();

        // -------------------
        //    BUTTON BUILDER
        // -------------------

        const follow = new ButtonBuilder()
            .setCustomId("follow")
            .setLabel(lang.userInfo.embed.button.label)
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(lang.userInfo.embed.button.emoji);

        // -------------------
        //    SEND INTERACT
        // -------------------  

        const row = new ActionRowBuilder().addComponents(follow);        
        
        await interaction.reply({
            content: mention,
            embeds: [embed],
            components: [row],
            ephemeral: false
        });
    }
};