const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
  
const { getTranslation } = require('../../languages/controller');
const lang = getTranslation();
  
const commands = require('../../resources/commands.json');

module.exports = 
{
    // -------------------
    //    SLASH BUILDER
    // -------------------  
    
    data: new SlashCommandBuilder()
        .setName(lang.playerHead.slash.name)
        .setDescription(lang.playerHead.slash.description)
        
        .addStringOption(option => option.setName(lang.playerHead.slash.option.name)
            .setDescription(lang.playerHead.slash.option.description)
            .setRequired(true)
        ),
  
    // -------------------
    //   COMMAND EXECUTE
    // -------------------

    async execute(interaction) 
    {
        let uuid;
        const mention = interaction.user.toString();
        const username = interaction.options.getString(lang.playerHead.slash.option.name);

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
        //    GET USER UUID
        // -------------------
        
        try 
        {
            const response = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${username}`);
            uuid = response.data.id;
        }

        // -------------------
        //   USER NOT FOUND
        // -------------------        
        
        catch (error) 
        {
            const headNotFoundEmbed = new EmbedBuilder()
                .setTitle(lang.playerHead.embed.notfound.title)
                .setDescription(lang.playerHead.embed.notfound.description.replace('{player_name}', username))
                .setColor("Red")
                .setTimestamp();
                
            return interaction.reply({
                content: mention,
                embeds: [headNotFoundEmbed],
                ephemeral: true
            });
        }

        // -------------------
        //     USER FOUND
        // -------------------        

        try 
        {
            const sucessEmbed = new EmbedBuilder()
                .setTitle(lang.playerHead.embed.showhead.title.replace('{player_name}', username))
                .setColor("Yellow")
                .setTimestamp()
                .setImage(`https://crafatar.com/avatars/${uuid}.png`);
                
            return interaction.reply({
                content: mention,
                embeds: [sucessEmbed],
                ephemeral: false
            });
        }

        // -------------------
        //    INTERNAL ERROR
        // -------------------        
        
        catch (error)
        {
            const criticalEmbed = new EmbedBuilder()
                .setTitle(lang.universal.embeds.broken.title)
                .setDescription(lang.universal.embeds.broken.description)
                .setColor("Red")
                .setTimestamp();
                
            return interaction.reply({
                content: mention,
                embeds: [criticalEmbed],
                ephemeral: true
            });
        }
    }
};