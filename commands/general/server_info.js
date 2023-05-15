const { EmbedBuilder, ChannelType } = require('discord.js');
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
        .setName(lang.serverInfo.slash.name)
        .setDescription(lang.serverInfo.slash.description),

    // -------------------
    //   COMMAND BUILDER
    // -------------------

    async execute(interaction) 
    {
        const guild = interaction.guild;
        const owner = guild.ownerId;
        const memberCount = guild.memberCount;
        const mention = interaction.user.toString();
        
        const roleCount = guild.roles.cache.size;
        const botCount = guild.members.cache.filter(member => member.user.bot).size;

        const textChannelCount = guild.channels.cache.filter(c => c.type === ChannelType.GuildText).size;
        const voiceChannelCount = guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size;
        const categoryChannelCount = guild.channels.cache.filter(c => c.type === ChannelType.GuildCategory).size;        
        
        // -------------------
        //    COMMAND CHECK
        // -------------------

        if(!config.commands.server_info) 
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
            .setTitle(lang.serverInfo.embed.title)
            .setColor("Blue")
            .setTimestamp()

            .setDescription(lang.serverInfo.embed.description
                .replace('{owner_id}', owner)
                .replace('{member_count}', memberCount)
                .replace('{role_count}', roleCount)
                .replace('{bot_count}', botCount)
                .replace('{channel_text_count}', textChannelCount)
                .replace('{channel_voice_count}', voiceChannelCount)
                .replace('{channel_category_count}', categoryChannelCount)
            )

            .setImage("https://assets.xboxservices.com/assets/fe/e0/fee04b36-43bb-4acc-98e7-a4118dfebd4c.jpg?n=Minecraft-Dungeons_Sneaky-Slider-1084_S1CloudyClimb_1600x675_02.jpg");

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
            console.log("[Minescord] => [C] Critical => An unknown error occurred in the Server Info command!");
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