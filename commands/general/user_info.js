const { EmbedBuilder } = require('discord.js');
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
        const mention = interaction.user.toString();
        
        const userID = user.id;
        const UserTag = user.tag;
        const UserName = user.username;
        const accountCreated = user.createdAt.toLocaleString();

        let is_bot = user.bot;
        if(is_bot) is_bot = "Yes";
        if(!is_bot) is_bot = "No";

        // -------------------
        //    COMMAND CHECK
        // -------------------

        if(!config.commands.user_info) 
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
        //    EMBED BUILDER
        // -------------------

        const mainEmbed = new EmbedBuilder()
            .setTitle(lang.userInfo.embed.title.replace('{user_name}', UserName))
            
            .setDescription(lang.userInfo.embed.description
                .replace('{account_created}', accountCreated)
                .replace('{user_id}', userID)
                .replace('{user_tag}', UserTag)
                .replace('{is_bot}', is_bot)
            )

            .setColor("Blue")
            .setTimestamp(); 

        // -------------------
        //     SEND EMBED
        // -------------------

        try
        {
            return interaction.reply({
                content: mention,
                embeds: [mainEmbed],
                ephemeral: false
            });
        }

        catch(error)
        {
            // -------------------
            //   ERROR FEEDBACK
            // -------------------
        
            console.log(error);
            console.log("[Minescord] => [C] Critical => An unknown error occurred in the User Info command!");
            console.log("[Minescord] => [L] Log => Send the log to: https://github.com/Henry8K/Minescord");
        
            // -------------------
            //     ERROR EMBED
            // -------------------            
        
            const errorEmbed = new EmbedBuilder()
                .setTitle(lang.universal.embeds.broken.title)
                .setDescription(lang.universal.embeds.broken.description)
                .setColor("DarkRed")
                .setTimestamp();

            // -------------------
            //     ERROR SEND
            // -------------------                
                
            return interaction.reply({
                content: mention,
                embeds: [errorEmbed],
                ephemeral: true
            });
        }        
    }
};