const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const { getTranslation } = require('../../languages/controller');
const lang = getTranslation();

const path = require('path');
const databasePath = path.resolve(__dirname, '../../database/users.json');
const database = require(databasePath);
const fs = require('fs');

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
        const userTag = user.tag;
        const userName = user.username;
        
        const mention = interaction.user.toString();
        const joinedDate = member.joinedAt.toLocaleDateString('en');
        const avatar = user.displayAvatarURL();
        const followersCount = database.users[userID]?.follows || 0;
        
        // -------------------
        //     BOT VERIFY
        // -------------------
        
        if(user.bot)
        {
            const botErrorEmbed = new EmbedBuilder()
                .setTitle(lang.userInfo.embed.error.bot.title)
                .setColor(lang.userInfo.embed.error.bot.color)
                .setDescription(lang.userInfo.embed.error.bot.description)
                .setTimestamp();
                
                return interaction.reply({
                    content: mention,
                    embeds: [botErrorEmbed],
                    ephemeral: true
                }
            );
        }

        // -------------------
        //    EMBED BUILDER
        // -------------------

        const mainEmbed = new EmbedBuilder()
            .setTitle(lang.userInfo.embed.title)
            .setColor(lang.userInfo.embed.color)
        
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

        const collector = embedMessage.createMessageComponentCollector({ time: 30000 });

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
                        .setTitle(lang.universal.user.title)
                        .setColor(lang.universal.user.color)
                        .setDescription(lang.universal.user.description)
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
                        .setTitle(lang.userInfo.embed.error.follow.title)
                        .setColor(lang.userInfo.embed.error.follow.color)
                        .setDescription(lang.userInfo.embed.error.follow.description)
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

                    const sucessEmbed = new EmbedBuilder()
                        .setTitle(lang.userInfo.embed.sucess.follow.title)
                        .setColor(lang.userInfo.embed.sucess.follow.color)
                        .setDescription(lang.userInfo.embed.sucess.follow.description.replace('{user_name}', userName))
                        .setTimestamp();
                        
                    return i.reply({
                        content: mention,
                        embeds: [sucessEmbed],
                        ephemeral: false,
                    });      
                
                } else
                {
                    const followingErrorEmbed = new EmbedBuilder()
                        .setTitle(lang.userInfo.embed.error.following.title)
                        .setColor(lang.userInfo.embed.error.following.color)
                        .setDescription(lang.userInfo.embed.error.following.description)
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