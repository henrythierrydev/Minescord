const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios').default;

const { getTranslation } = require('../../languages/controller');
const lang = getTranslation();

const config = require('../../resources/about.json');
const commands = require('../../resources/commands.json');

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
        const ip = config.server.ip;
        const port = config.server.port;
        const name = config.server.name;
        const mention = interaction.user.toString();

        let response = ""

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
        //   BEDROCK SERVER
        // -------------------

        if(config.server.type === "bedrock") 
        {
            response = await axios.get(`https://api.mcstatus.io/v2/status/bedrock/${ip}:${port}`);
        }

        // -------------------
        //     JAVA SERVER
        // -------------------
        
        if(config.server.type === "java") 
        {
            response = await axios.get(`https://api.mcstatus.io/v2/status/java/${ip}:${port}`);
        }

        // -------------------
        //     ANTI ERROR
        // -------------------

        if(config.server.additional.maintence && config.server.additional.not_realeased) 
        {
            console.log("[Minescord] => [C] Critical => Values [maintence & not_realeased] cannot be equals!");
            console.log("[Minescord] => [L] Log => Change the maintence/not_realeased in resources/about.json");
            return;
        }

        // -------------------
        //   MAINTENCE MODE
        // -------------------

        if(config.server.additional.maintence)
        {
            const maintenceEmbed = new EmbedBuilder()
                .setTitle(lang.status.embed.maintence.title)
                .setDescription(lang.status.embed.maintence.description)
                .setColor("Yellow")
                .setTimestamp();
                
            return interaction.reply({
                content: mention,
                embeds: [maintenceEmbed],
                ephemeral: false
            });
        }

        // -------------------
        //    NOT REALEASED
        // -------------------        

        if(config.server.additional.not_realeased) 
        {
            const nrealeasedEmbed = new EmbedBuilder()
                .setTitle(lang.status.embed.nrealeased.title)
                .setDescription(lang.status.embed.nrealeased.description)
                .setColor("Red")
                .setTimestamp();
                
            return interaction.reply({
                content: mention,
                embeds: [nrealeasedEmbed],
                ephemeral: false
            });
        }

        // -------------------
        //    SUCESS STATUS
        // -------------------

        try
        {
            const data = response.data;
            const isOnline = data.online || false;
            const maxPlayers = data.players.max || 0;
            const playerCount = data.players.online || 0;
            
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
                
            return interaction.reply({
                content: mention,
                embeds: [statusEmbed],
                ephemeral: false
            });
        }

        catch(error)
        {
            // -------------------
            //     ERRORS LOGS
            // -------------------
        
            console.log("[Minescord] => [C] Critical => Server IP/port not found!");
            console.log("[Minescord] => [L] Log => Change the IP/port in resources/about.json");
        
            // -------------------
            //    ERRORS EMBED
            // -------------------            
        
            const errorEmbed = new EmbedBuilder()
                .setTitle(lang.status.embed.notfound.title)
                .setDescription(lang.status.embed.notfound.description)
                .setColor("DarkRed")
                .setTimestamp();
                
            interaction.reply({
                content: mention,
                embeds: [errorEmbed],
                ephemeral: true
            });
        }
    }
};