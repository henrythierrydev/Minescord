const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const { getTranslation } = require('../../languages/controller');
const lang = getTranslation();

const data = require('../../resources/about.json');

module.exports = 
{
    // -------------------
    //    SLASH BUILDER
    // -------------------

    data: new SlashCommandBuilder()
        .setName(lang.ip.slash.name)
        .setDescription(lang.ip.slash.description),

    // -------------------
    //   COMMAND BUILDER
    // -------------------

    async execute(interaction) 
    {
        let port = "";
        const ip = data.server.ip;
        const name = data.server.name;
        const user = interaction.user.username;
        const mention = interaction.user.toString();

        // -------------------
        //     PORT CHECK
        // -------------------        

        if(data.server.type === "bedrock" && data.server.port === "default") {
            port = "19132";
        }

        if(data.server.type === "java" && data.server.port === "default") {
            port = "Default";
        }

        // -------------------
        //    EMBED BUILDER
        // -------------------

        const embed = new EmbedBuilder()
            .setTitle(lang.ip.embed.title)
            .setColor(lang.ip.embed.color)
            .setTimestamp()

            .setDescription(lang.ip.embed.description
                .replace('{server_ip}', ip)
                .replace('{user_name}', user)
                .replace('{server_port}', port)
                .replace('{server_name}', name)
            );

        await interaction.reply({
            content: mention,
            embeds: [embed],
            ephemeral: false
        });
    }
};