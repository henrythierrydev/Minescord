const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const { getTranslation } = require('../../languages/controller');
const lang = getTranslation();

const data = require('../../resources/about.json');
const commands = require('../../resources/commands.json');

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
        const ip = data.server.ip;
        const name = data.server.name;
        const port = data.server.port;
        const user = interaction.user.username;
        const mention = interaction.user.toString();

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
        //    EMBED BUILDER
        // -------------------

        const ipEmbed = new EmbedBuilder()
            .setTitle(lang.ip.embed.title)
            .setColor("#0fd419")
            .setTimestamp()

            .setDescription(lang.ip.embed.description
                .replace('{server_ip}', ip)
                .replace('{user_name}', user)
                .replace('{server_port}', port)
                .replace('{server_name}', name)
            );

        // -------------------
        //     SEND EMBED
        // -------------------

        await interaction.reply({
            content: mention,
            embeds: [ipEmbed],
            ephemeral: false
        });
    }
};