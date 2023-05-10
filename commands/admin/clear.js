const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const { getTranslation } = require('../../languages/controller');
const lang = getTranslation(); 

module.exports =
{
    // -------------------
    //    SLASH BUILDER
    // -------------------

    data: new SlashCommandBuilder()
        .setName(lang.clear.slash.name)
        .setDescription(lang.clear.slash.description)
        
        .addIntegerOption(option => option.setName(lang.universal.slash.int.name)
            .setDescription(lang.universal.slash.int.description)
            .setRequired(true)
        ),

    // -------------------
    //   COMMAND EXECUTE
    // -------------------

    async execute(interaction)
    {
        const author = interaction.user.username;
        const mention = interaction.user.toString();
        const value = interaction.options.getInteger(lang.universal.slash.int.name);
        
        // -------------------
        //     PERMS CHECK
        // -------------------
        
        if(!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) 
        {
            const permissionEmbed = new EmbedBuilder()
                .setTitle(lang.universal.embeds.permission.title)
                .setDescription(lang.universal.embeds.permission.description)
                .setColor("Red")
                .setTimestamp();
            
                return interaction.reply({
                    content: mention,
                    embeds: [permissionEmbed],
                    ephemeral: true
                }
            );
        }
        
        // -------------------
        //     LIMIT CHECK
        // -------------------

        if(value < 1 || value > 100) 
        {    
            const valueErrorEmbed = new EmbedBuilder()
                .setTitle(lang.clear.embed.value.title)
                .setDescription(lang.clear.embed.value.description)
                .setColor("Yellow")
                .setTimestamp();
                
                return interaction.reply({
                    content: mention,
                    embeds: [valueErrorEmbed],
                    ephemeral: true
                }
            );
        }

        // -------------------
        //    SUCESS CLEAR
        // -------------------
        
        await interaction.channel.bulkDelete(value, true);
        
        const successEmbed = new EmbedBuilder()
            .setTitle(lang.clear.embed.cleaned.title)
            
            .setDescription(lang.clear.embed.cleaned.description
                .replace('{value}', value)
                .replace('{author}', author))
            
            .setColor("Green")
            .setTimestamp();

        // -------------------
        //     SEND EMBED
        // -------------------

        return interaction.reply({
            content: mention,
            embeds: [successEmbed],
            ephemeral: false
        });
    },
};