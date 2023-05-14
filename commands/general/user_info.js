const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const { getTranslation } = require('../../languages/controller');
const lang = getTranslation();

const path = require('path');
const databasePath = path.resolve(__dirname, '../../database/users.json');
const database = require(databasePath);

const commands = require('../../resources/commands.json');
const collector = require('../../interactions/userInfo');

module.exports = 
{
    // -------------------
    //    SLASH BUILDER
    // -------------------

    data: new SlashCommandBuilder()
        .setName(lang.userInfo.slash.name)
        .setDescription(lang.userInfo.slash.description)

        .addUserOption(option => option.setName(lang.universal.slash.user.name)
            .setDescription(lang.universal.slash.user.description)
            .setRequired(true)
        ),

    // -------------------
    //   COMMAND BUILDER
    // -------------------

    async execute(interaction) 
    {
        const user = interaction.options.getUser(lang.universal.slash.user.name);
        const member = interaction.guild.members.cache.get(user.id);
        
        const userID = user.id;
        const userTag = user.tag;
        const userName = user.username;
        
        const mention = interaction.user.toString();
        const joinedDate = member.joinedAt.toLocaleDateString('en');
        const avatar = user.displayAvatarURL();
        const followersCount = database.users[userID]?.follows || 0;

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
        //     BOT VERIFY
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
        //    EMBED BUILDER
        // -------------------

        const mainEmbed = new EmbedBuilder()
            .setTitle(lang.userInfo.embed.title)
            .setColor("Blue")
        
            .setThumbnail(avatar)

            .addFields(
                { name: lang.userInfo.embed.fields.tag, value: "```" + userTag + "```" },
                { name: lang.userInfo.embed.fields.id, value: "```" + userID + "```"},
                { name: lang.userInfo.embed.fields.joined, value: "```" + joinedDate + "```"},
                { name: lang.userInfo.embed.fields.followers, value: "```" + followersCount + "```"}
            )

            .setTimestamp();

        // -------------------
        //    BUTTON BUILDER
        // -------------------

        const followButton = new ButtonBuilder()
            .setCustomId("follow")
            .setLabel(lang.userInfo.embed.button.label)
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(lang.userInfo.embed.button.emoji);

        // -------------------
        //    SEND INTERACT
        // -------------------  

        const components = new ActionRowBuilder().addComponents(followButton);        
        
        const userInfoEmbed = await interaction.reply({
            content: mention,
            embeds: [mainEmbed],
            components: [components],
            ephemeral: false
        });

        // -------------------
        //   BUTTON INTERACT
        // -------------------

        collector(userInfoEmbed, userID, mention, userName, lang, interaction);
    }
};