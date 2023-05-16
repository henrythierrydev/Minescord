const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios').default;

const config = require('../../resources/config.json');
const { getTranslation } = require('../../languages/controller');
const lang = getTranslation();

module.exports = 
{
    // -------------------
    //    SLASH BUILDER
    // -------------------

    data: new SlashCommandBuilder()
        .setName(lang.status.slash.name)
        .setDescription(lang.status.slash.description),

    // -------------------
    //   COMMAND EXECUTE
    // -------------------
    
    async execute(interaction)
    {
        const ip = config.about.server_adress;
        const port = config.about.server_port;
        const name = config.about.server_name;

        let response = ""
        const mention = interaction.user.toString();

        // -------------------
        //    COMMAND CHECK
        // -------------------

        if(!config.commands.status) 
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
        //     SERVER TYPE
        // -------------------

        if(config.about.server_type === "bedrock") {
            response = await axios.get(`https://api.mcstatus.io/v2/status/bedrock/${ip}:${port}`);
        } else {
            response = await axios.get(`https://api.mcstatus.io/v2/status/java/${ip}:${port}`);
        }

        // -------------------
        //    SUCESS QUERY
        // -------------------

        try
        {
            const data = response.data;
            const isOnline = data.online || false;
            const maxPlayers = data.players.max || 0;
            const playerCount = data.players.online || 0;
            
            // -------------------
            //    STATUS EMBED
            // -------------------            
            
            const statusEmbed = new EmbedBuilder()
                .setTitle(lang.status.embed.status.title)
                
                .setDescription(lang.status.embed.status.description
                    .replace('{server_ip}', ip)
                    .replace('{server_name}', name)
                    .replace('{max_players}', maxPlayers)
                    .replace('{current_players}', playerCount)
                    .replace('{online_check}', isOnline ? 'Online' : 'Offline')
                )
                
                .setColor("Green")
                .setThumbnail(`https://api.mcstatus.io/v2/icon/${ip}:${port}`)
                .setTimestamp();

            // -------------------
            //    STATUS SEND
            // -------------------
                
            return interaction.reply({
                content: mention,
                embeds: [statusEmbed],
                ephemeral: false
            });
        }

        catch(error)
        {
            // -------------------
            //   ERROR FEEDBACK
            // -------------------
        
            console.log(error);
            console.log("[Minescord] => [C] Critical => An unknown error occurred in the Status command!");
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