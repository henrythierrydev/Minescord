const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const { getCommands } = require('../../Languages/controller');
const commands = getCommands();

const database = require('../../Resources/socials.json'); 

// -------------------
//    COMMAND START
// -------------------

module.exports = {

    // -------------------
    //   COMMAND BUILDER
    // -------------------

    data: new SlashCommandBuilder()
        .setName(commands.socials.name)
        .setDescription(commands.socials.description),

    // -------------------
    //   COMMAND EXECUTE
    // -------------------

    async execute(interaction)
    {
        const userMention = interaction.user.toString();
        
        // -------------------
        //    EMBED BUILDER
        // -------------------
        
        const socialembed = new EmbedBuilder()
            .setTimestamp()
            .setTitle(commands.socials.embed.title)
            .setDescription(commands.socials.embed.description)
            .setColor(commands.socials.embed.color)
            .setImage(commands.socials.embed.thumbnail);

        // -------------------
        //   YOUTUBE BUTTON
        // -------------------

        const row = new ActionRowBuilder();
        
        if(database.links.youtube.active === "true") 
        {
            const yt = new ButtonBuilder()
                .setLabel("Youtube")
                .setStyle(ButtonStyle.Link)
                .setURL(database.links.youtube.link)
                .setEmoji(database.links.youtube.emoji);

                row.addComponents(yt);
        }

        // -------------------
        //   TWITTER BUTTON
        // -------------------
        
        if(database.links.twitter.active === "true")
        {
            const tw = new ButtonBuilder()
                .setLabel("Twitter")
                .setStyle(ButtonStyle.Link)
                .setURL(database.links.twitter.link)
                .setEmoji(database.links.twitter.emoji);

                row.addComponents(tw);
        }
        
        // -------------------
        //  INSTAGRAM BUTTON
        // -------------------

        if(database.links.instagram.active === "true")
        {
            const is = new ButtonBuilder()
                .setLabel("Instagram")
                .setStyle(ButtonStyle.Link)
                .setURL(database.links.instagram.link)
                .setEmoji(database.links.instagram.emoji);

                row.addComponents(is);
        }

        // -------------------
        //    REDDIT BUTTON
        // -------------------

        if(database.links.reddit.active === "true")
        {
            const rd = new ButtonBuilder()
                .setLabel("Reddit")
                .setStyle(ButtonStyle.Link)
                .setURL(database.links.reddit.link)
                .setEmoji(database.links.reddit.emoji);

                row.addComponents(rd);
        }

        // -------------------
        //    REDDIT BUTTON
        // -------------------

        if(database.links.facebook.active === "true")
        {
            const fb = new ButtonBuilder()
                .setLabel("Facebook")
                .setStyle(ButtonStyle.Link)
                .setURL(database.links.facebook.link)
                .setEmoji(database.links.facebook.emoji);

                row.addComponents(fb);
        }

        const rows = [row];

        // -------------------
        //    EMBED SENDER
        // -------------------

        await interaction.reply({
            content: userMention,
            embeds: [socialembed],
            components: rows
        });
    }
}