const { EmbedBuilder } = require('discord.js');

const fs = require('fs');
const path = require('path');
const databasePath = path.resolve(__dirname, '../database/users.json');
const database = require(databasePath);

// -------------------
//     INTERACTION
// -------------------

const collector = (userInfoEmbed, userID, mention, userName, lang, interaction) => 
{
    const collector = userInfoEmbed.createMessageComponentCollector({ time: 3600000 });
    
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

            if(!localbase.users[currentUserID]) {
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
            }
            else 
            {
                // -------------------
                //     FOLLOW FAIL
                // -------------------

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
};

module.exports = collector;