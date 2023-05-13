const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const { getTranslation } = require('../../languages/controller');
const lang = getTranslation();

const fs = require('fs');
const path = require('path');
const databasePath = path.resolve(__dirname, '../../database/users.json');
const database = require(databasePath);

const commands = require('../../resources/commands.json');

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
        
        const embedMessage = await interaction.reply({
            content: mention,
            embeds: [mainEmbed],
            components: [components],
            ephemeral: false
        });

        // -------------------
        //   BUTTON INTERACT
        // -------------------

        const collector = embedMessage.createMessageComponentCollector({ time: 3600000 });

        collector.on("collect", async (i) => 
        {
            if(i.customId === "follow") 
            {
                // -------------------
                //     USER CHECK
                // -------------------
        
                if(i.user.id !== interaction.user.id) 
                {
                    const userErrorEmbed = new EmbedBuilder()
                        .setTitle(lang.universal.embeds.user.title)
                        .setColor("Yellow")
                        .setDescription(lang.universal.embeds.user.description)
                        .setTimestamp();
    
                    return i.reply({
                        content: mention,
                        embeds: [userErrorEmbed],
                        ephemeral: true,
                    });
                }
                
                // -------------------
                //    FOLLOW CHECK
                // -------------------
        
                if(i.user.id === userID) 
                {
                    const followErrorEmbed = new EmbedBuilder()
                        .setTitle(lang.userInfo.embed.yourself.title)
                        .setColor("Red")
                        .setDescription(lang.userInfo.embed.yourself.description)
                        .setTimestamp();
                        
                    return i.reply({
                        content: mention,
                        embeds: [followErrorEmbed],
                        ephemeral: true,
                    });
                }

                // -------------------
                //     FOLLOW ADD
                // -------------------
                
                let localbase = database;
                const currentUserID = interaction.user.id;
                const followingUserID = userID;

                // -------------------
                //     USER EXISTS
                // -------------------
                
                if(!localbase.users[currentUserID]) 
                {
                    localbase.users[currentUserID] = {
                        follows: 0,
                        following: {},
                    };
                }

                // -------------------
                //    FOLLOW CHECK
                // -------------------                

                if(!localbase.users[currentUserID].following[followingUserID]) 
                {
                    const followsCount = localbase.users[followingUserID]?.follows || 0;
                    
                    localbase.users[followingUserID] = {
                        follows: followsCount + 1,
                        following: {},
                    };
                    
                    localbase.users[currentUserID].following[followingUserID] = followsCount + 1;
                    fs.writeFileSync(databasePath, JSON.stringify(localbase));

                    const successEmbed = new EmbedBuilder()
                        .setTitle(lang.userInfo.embed.successfollow.title)
                        .setColor("Green")
                        .setDescription(lang.userInfo.embed.successfollow.description.replace('{user_name}', userName))
                        .setTimestamp();
                        
                    return i.reply({
                        content: mention,
                        embeds: [successEmbed],
                        ephemeral: false,
                    });      
                
                } else
                {
                    const followingErrorEmbed = new EmbedBuilder()
                        .setTitle(lang.userInfo.embed.alreadyfollowing.title)
                        .setColor("Red")
                        .setDescription(lang.userInfo.embed.alreadyfollowing.description)
                        .setTimestamp();
                        
                    return i.reply({
                        content: mention,
                        embeds: [followingErrorEmbed],
                        ephemeral: true,
                    });
                }
            }
        });
    }
};