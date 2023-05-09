const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

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
        
        const roleCount = guild.roles.cache.size;
        const botCount = guild.members.cache.filter(member => member.user.bot).size;
        
        const channelCount = guild.channels.cache.size;
        const mention = interaction.user.toString();
        
        // -------------------
        //    EMBED BUILDER
        // -------------------

        const mainEmbed = new EmbedBuilder()
            .setTitle(lang.serverInfo.embed.title)
            .setColor(lang.serverInfo.embed.color)
            .setTimestamp()

            .setDescription(lang.serverInfo.embed.description
                .replace('{owner_id}', owner)
                .replace('{member_count}', memberCount)
                .replace('{role_count}', roleCount)
                .replace('{bot_count}', botCount)
                .replace('{channel_count}', channelCount)
            )

            .setImage("https://assets.xboxservices.com/assets/fe/e0/fee04b36-43bb-4acc-98e7-a4118dfebd4c.jpg?n=Minecraft-Dungeons_Sneaky-Slider-1084_S1CloudyClimb_1600x675_02.jpg");

        // -------------------
        //     SEND EMBED
        // -------------------

        await interaction.reply({
            content: mention,
            embeds: [mainEmbed],
            ephemeral: false
        });
    }
};