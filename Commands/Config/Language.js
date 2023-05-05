const { EmbedBuilder, ButtonBuilder, PermissionFlagsBits, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const { getMessages, getCommands } = require('../../Languages/controller');
const messages = getMessages();
const commands = getCommands();

const fs = require('fs');
const config = require('../../config.json');

module.exports =
{
    //---------------------
    //    SLASH BUILDER
    // --------------------

    data: new SlashCommandBuilder()
        .setName(commands.language.name)
        .setDescription(commands.language.description)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

        //---------------------
        //    SLASH EXECUTE
        // --------------------        
        
        async execute(interaction)
        {
            const member = interaction.member;
            const userMention = interaction.user.toString();
            const authorAvatar = interaction.member.user.avatarURL();
            
            //---------------------
            //    EMBED CREATOR
            // --------------------   
            
            const embed = new EmbedBuilder()
                .setTimestamp()
                .setTitle(commands.language.embed.title)
                .setDescription(commands.language.embed.description)
                .setColor("#e6de0b")
                .setThumbnail(authorAvatar)

            //---------------------
            //    BUTTON CREATOR
            // --------------------

            const enButton = new ButtonBuilder()
                .setEmoji("🇺🇸")
                .setCustomId("enbutton")
                .setLabel(commands.language.embed.en_button)
                .setStyle(ButtonStyle.Secondary)

            const ptButton = new ButtonBuilder()
                .setEmoji("🇧🇷")
                .setCustomId("ptbutton")
                .setLabel(commands.language.embed.pt_button)
                .setStyle(ButtonStyle.Secondary)
                
            const esButton = new ButtonBuilder()
                .setEmoji("🇪🇸")
                .setCustomId("esbutton")
                .setLabel(commands.language.embed.es_button)
                .setStyle(ButtonStyle.Secondary)
                
            //---------------------
            //  INTERACTION BUILD
            // --------------------
            
            const components = new ActionRowBuilder()
                .addComponents(enButton, ptButton, esButton);

            //---------------------
            //  INTERACTION SEND
            // --------------------      

            await interaction.reply({
                content: userMention,
                embeds: [embed],
                components: [components]
            });

            //---------------------
            //   BUTTON INTERACT
            // --------------------

            const collector = interaction.channel.createMessageComponentCollector({
                filter: (buttonInteraction) => buttonInteraction.user.id === interaction.user.id,
                max: 1
            });
            
            collector.on('collect', async buttonInteraction => 
            {                
                //---------------------
                //   ENGLISH BUTTON
                // --------------------

                if(buttonInteraction.customId === 'enbutton') 
                {
                    config.lang = "en";
                    fs.writeFileSync('./config.json', JSON.stringify(config));
                    
                    const enEmbed = new EmbedBuilder()
                        .setTimestamp()
                        .setTitle(messages.general.sucess)
                        .setDescription("The language was changed to **English** successfully!\n\n**Warning** You need to reload the bot in the console to have the changes validated and the new implementations take effect.")
                        .setColor("#0bfc03")
                        .setThumbnail(authorAvatar)
                    
                    
                    await buttonInteraction.reply({
                        content: userMention,
                        embeds: [enEmbed]
                    });
                }

                //---------------------
                //  PORTUGUESE BUTTON
                // --------------------                

                if(buttonInteraction.customId === 'ptbutton') 
                {
                    config.lang = "pt";
                    fs.writeFileSync('./config.json', JSON.stringify(config));
                    
                    const ptEmbed = new EmbedBuilder()
                        .setTimestamp()
                        .setTitle(messages.general.sucess)
                        .setDescription("O idioma foi alterado para **Português** com sucesso!\n\n**Aviso** Você precisa recarregar o bot no console para fazer com que as alterações sejam validadas e as novas implementações entrem em vigor.")
                        .setColor("#0bfc03")
                        .setThumbnail(authorAvatar)
                    
                    await buttonInteraction.reply({
                        content: userMention,
                        embeds: [ptEmbed]
                    });
                }                

                //---------------------
                //   SPANISH BUTTON
                // --------------------                

                if(buttonInteraction.customId === 'esbutton') 
                {
                    config.lang = "es";
                    fs.writeFileSync('./config.json', JSON.stringify(config));
                    
                    const esEmbed = new EmbedBuilder()
                        .setTimestamp()
                        .setTitle(messages.general.sucess)
                        .setDescription("La idioma se cambió con éxito a **Español**!\n\n**Advertencia:** Es necesario reiniciar el bot en la consola para que los cambios sean validados y las nuevas implementaciones tengan efecto.")
                        .setColor("#0bfc03")
                        .setThumbnail(authorAvatar)
                    
                    
                    await buttonInteraction.reply({
                        content: userMention,
                        embeds: [esEmbed]
                    });
                }
            });
        }
}