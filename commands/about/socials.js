const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const { getTranslation } = require('../../languages/controller');
const lang = getTranslation(); 

const data = require('../../resources/socials.json');
const commands = require('../../resources/commands.json');

module.exports = 
{
    // -------------------
    //    SLASH BUILDER
    // -------------------

    data: new SlashCommandBuilder()
        .setName(lang.socials.slash.name)
        .setDescription(lang.socials.slash.description),

    // -------------------
    //   COMMAND EXECUTE
    // -------------------

    async execute(interaction)
    {
        const row = new ActionRowBuilder();
        const mention = interaction.user.toString();
        const socialsPlatforms = ['youtube', 'twitter', 'instagram', 'reddit', 'facebook'];

        const socials = data.socials;
        const allInactive = !Object.values(socials).some(social => social.active);

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
        //    SOCIALS CHECK
        // -------------------
        
        if(allInactive) 
        {
            const inactiveEmbed = new EmbedBuilder()
                .setTimestamp()
                .setTitle(lang.socials.embed.inactive.title)
                .setDescription(lang.socials.embed.inactive.description)
                .setColor("Red");

            return interaction.reply({
                content: mention,
                embeds: [inactiveEmbed],
                ephemeral: true
            });
        }
        
        // -------------------
        //    SOCIAL EMBED
        // -------------------
        
        const socialEmbed = new EmbedBuilder()
            .setTitle(lang.socials.embed.social.title)
            .setDescription(lang.socials.embed.social.description)
            .setColor("Purple")
            .setImage("https://blog.connectedcamps.com/wp-content/uploads/2017/01/novaskin-minecraft-wallpaper-2.jpeg")
            .setTimestamp();

        // -------------------
        //   SOCIALS BUTTONS
        // -------------------

        for(const platform of socialsPlatforms) 
        {
            if(data.socials[platform].active)
            {
                const socialsButton = new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setURL(data.socials[platform].link)
                    .setEmoji(data.socials[platform].emoji)
                    .setLabel(platform.charAt(0).toUpperCase() + platform.slice(1));

                row.addComponents(socialsButton);
            }
        }
    
        const modules = [row];

        // -------------------
        //     SEND SOCIALS
        // -------------------

        try {
            
            return interaction.reply({
                content: mention,
                embeds: [socialEmbed],
                components: modules,
                ephemeral: false
            });
        }

        catch(error)
        {
            // -------------------
            //     ERRORS LOGS
            // -------------------
        
            console.log("[Minescord] => [C] Critical => An unknown error occurred in the Social command!");
            console.log("[Minescord] => [L] Log => Send the log to: https://github.com/Henry8K/Minescord/issues");
        
            // -------------------
            //    ERRORS EMBED
            // -------------------            
        
            const errorEmbed = new EmbedBuilder()
                .setTitle(lang.universal.embeds.broken.title)
                .setDescription(lang.universal.embeds.broken.description)
                .setColor("DarkRed")
                .setTimestamp();
                
            return interaction.reply({
                content: mention,
                embeds: [errorEmbed],
                ephemeral: true
            });
        }
    }
};