const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios').default;

const { getTranslation } = require('../../languages/controller');
const lang = getTranslation();

const config = require('../../resources/about.json');

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
                .setTitle(lang.status.embed.error.maintence.title)
                .setDescription(lang.status.embed.error.maintence.description)
                .setColor(lang.status.embed.error.maintence.color)
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
                .setTitle(lang.status.embed.error.nrealeased.title)
                .setDescription(lang.status.embed.error.nrealeased.description)
                .setColor(lang.status.embed.error.nrealeased.color)
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
            const playerCount = data.players.online || 0;
            const maxPlayers = data.players.max || 0;
            
            const statusEmbed = new EmbedBuilder()
                .setTitle(lang.status.embed.sucess.title)
                .setColor(lang.status.embed.sucess.color)
                .setTimestamp()
                
                .setDescription(lang.status.embed.sucess.description
                    .replace('{server_ip}', ip)
                    .replace('{server_name}', name)
                    .replace('{max_players}', maxPlayers)
                    .replace('{current_players}', playerCount)
                    .replace('{online_check}', isOnline ? 'Online' : 'Offline')
                );
                
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
                .setTitle(lang.status.embed.error.notfound.title)
                .setDescription(lang.status.embed.error.notfound.description)
                .setColor(lang.status.embed.error.notfound.color)
                .setTimestamp();
                
            interaction.reply({
                content: mention,
                embeds: [errorEmbed],
                ephemeral: true
            });
        }
    }
};