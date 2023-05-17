const { EmbedBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder, ChannelType } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const embed = require('../../resources/embeds.json');
const config = require('../../resources/config.json');
const { getTranslation } = require('../../languages/controller');
const lang = getTranslation();

const fs = require('fs');
const path = require('path');
const dataPath = path.resolve(__dirname, '../../resources/data/ticket.json');
const data = require(dataPath);

module.exports = 
{
    // -------------------
    //    SLASH BUILDER
    // -------------------

    data: new SlashCommandBuilder()
        .setName(lang.sendTicket.slash.name)
        .setDescription(lang.sendTicket.slash.description)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    // -------------------
    //   COMMAND BUILDER
    // -------------------

    async execute(interaction)
    {
        const guild = interaction.guild;
        const mention = interaction.user.toString();
        const title = embed.ticket.title;
        const description = embed.ticket.description;
        const banner = embed.ticket.banner;
        const buttonLabel = embed.ticket.button.label;
        const buttonEmoji = embed.ticket.button.emoji;
        const channel = guild.channels.cache.find(channel => channel.id === data.tickets.ticket_channel);
        const category = guild.channels.cache.find(category => category.id === data.tickets.ticket_category);

        // -------------------
        //    COMMAND CHECK
        // -------------------

        if(!config.commands.ticket) 
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
        //    TICKET CHECK
        // -------------------

        if(data.tickets.ticket_channel === "" || data.tickets.ticket_category === "")
        {
            const incompleteConfig = new EmbedBuilder()
                .setTitle(lang.sendTicket.embed.incompleteconfig.title)
                .setDescription(lang.sendTicket.embed.incompleteconfig.description)
                .setColor("Red")
                .setTimestamp();
            
            return interaction.reply({
                content: mention,
                embeds: [incompleteConfig],
                ephemeral: true
            });            
        }

        // -------------------
        //    CHANNEL CHECK
        // -------------------

        if (!guild.channels.cache.has(channel.id) || !guild.channels.cache.has(category.id))
        {
            const notFoundChannels = new EmbedBuilder()
                .setTitle(lang.sendTicket.embed.notfoundchannels.title)
                .setDescription(lang.sendTicket.embed.notfoundchannels.description)
                .setColor("Red")
                .setTimestamp();
            
            return interaction.reply({
                content: mention,
                embeds: [notFoundChannels],
                ephemeral: true
            });
        }

        // -------------------
        //    EMBED BUILDER
        // -------------------
        
        const sendTicketEmbed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setImage(banner)
            .setColor("Blue");

        // -------------------
        //    BUTTON BUILDER
        // -------------------

        const sendTicketButton = new ButtonBuilder()
            .setCustomId("tsembed")
            .setLabel(buttonLabel)
            .setEmoji(buttonEmoji)
            .setStyle(ButtonStyle.Secondary);

        const modules = new ActionRowBuilder().addComponents(sendTicketButton);

        // -------------------
        //     SEND TICKET
        // -------------------

        const message = await channel.send({
            embeds: [sendTicketEmbed],
            components: [modules],
            ephemeral: false
        });

        // -------------------
        //   TICKET INTERACT
        // -------------------
        
        const filter = (i) => i.customId === "tsembed";
        const collector = message.createMessageComponentCollector({ filter });
        
        collector.on("collect", async (i) => 
        {
            const userID = i.user.id;
            const userName = i.user.username;
            const ticketCreatedMention = i.user.toString()
            const ticketcreatedTitle = embed.ticket.created.title;
            const ticketcreatedDescription = embed.ticket.created.description;
            const ticketCreatedButtonLabel = embed.ticket.created.button.label;
            const ticketCreatedButtonEmoji = embed.ticket.created.button.emoji;

            // -------------------
            //     DATA CHECK
            // -------------------

            if(data.users[userID]) 
            {
                const alreadyCreated = new EmbedBuilder()
                    .setTitle(lang.sendTicket.embed.alreadycreated.title)
                    .setDescription(lang.sendTicket.embed.alreadycreated.description)
                    .setColor("Red")
                    .setTimestamp();

                return i.reply({
                    content: ticketCreatedMention,
                    embeds: [alreadyCreated],
                    ephemeral: true
                });
            }
            else 
            {
                // -------------------
                //   CREATE CHANNEL
                // -------------------

                await i.guild.channels.create(
                {    
                    name: `ticket-${userName}`,
                    parent: category,
                    type: ChannelType.GuildText,
                    
                    permissionOverwrites: [
                    {
                        id: i.guild.id,
                        deny: [ PermissionFlagsBits.ViewChannel ]
                    },

                    {
                        id: i.user.id,
                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.AddReactions,
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.AttachFiles,
                            PermissionFlagsBits.EmbedLinks,
                            PermissionFlagsBits.UseApplicationCommands
                        ]
                    }]

                // -------------------
                //    SEND MESSAGE
                // -------------------   
                
                }).then(async(ticketChat) => 
                {
                    // -------------------
                    //    EMBED BUILDER
                    // -------------------

                    const ticketCreatedEmbed = new EmbedBuilder()
                        .setTitle(ticketcreatedTitle)
                        .setDescription(ticketcreatedDescription)
                        .setColor("Green");
                        
                    // -------------------
                    //    BUTTON BUILDER
                    // -------------------

                    const ticketCreatedButton = new ButtonBuilder()
                        .setCustomId("tcembed")
                        .setLabel(ticketCreatedButtonLabel)
                        .setEmoji(ticketCreatedButtonEmoji)
                        .setStyle(ButtonStyle.Secondary);

                    // -------------------
                    //     MESSAGE SEND
                    // -------------------                        
                    
                    const ticketModules = new ActionRowBuilder().addComponents(ticketCreatedButton);                        

                    const ticketChatMessage = await ticketChat.send({
                        content: ticketCreatedMention,
                        embeds: [ticketCreatedEmbed],
                        components: [ticketModules]
                    });

                    // -------------------
                    //   BUTTON INTERACT
                    // -------------------                        

                    const filter = (c) => c.customId === "tcembed";
                    const collector = ticketChatMessage.createMessageComponentCollector({ filter });
                    
                    collector.on("collect", async (c) => 
                    {
                        const closeAuthorMention = c.user.toString();
                        const closeButtonMember = interaction.guild.members.cache.get(c.user.id);

                        if(!closeButtonMember.permissions.has(PermissionFlagsBits.Administrator))
                        {   
                            const noPermissionError = new EmbedBuilder()
                                .setTitle(lang.universal.embeds.adm.title)
                                .setDescription(lang.universal.embeds.adm.description)
                                .setColor("Red");
                                
                            return c.reply({
                                content: closeAuthorMention,
                                embeds: [noPermissionError],
                                ephemeral: true
                            });
                        }

                        // -------------------
                        //     CLOSE EMBED
                        // -------------------
                            
                        const ticketCloseEmbed = new EmbedBuilder()
                            .setTitle(lang.sendTicket.embed.close.title)
                            .setDescription(lang.sendTicket.embed.close.description)
                            .setColor("Yellow");

                        // -------------------
                        //     SEND CLOSE
                        // -------------------                            
                        
                        await c.reply({
                            content: closeAuthorMention,
                            embeds: [ticketCloseEmbed]
                        });

                        // -------------------
                        //     WAIT DELETE
                        // -------------------                        
                            
                        setTimeout(async () => 
                        {
                            delete data.users[userID];
                            fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
                            ticketChat.delete();
                        }, 5000);                                 
                    });
                }
                
                ).catch(e => console.error(e));

                
                // -------------------
                //    ADD TO DATA
                // -------------------

                data.users[userID] = {};
                fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

                // -------------------
                //    CREATED EMBED
                // -------------------    
                 
                const successCreated = new EmbedBuilder()
                    .setTitle(lang.sendTicket.embed.successcreated.title)
                    .setDescription(lang.sendTicket.embed.successcreated.description)
                    .setColor("Green");

                // -------------------
                //    CREATED SEND
                // -------------------                    
                
                return i.reply({
                    content: ticketCreatedMention,
                    embeds: [successCreated],
                    ephemeral: true
                });
            }
        });

        // -------------------
        //   FEEDBACK EMBED
        // -------------------        

        const successEmbed = new EmbedBuilder()
            .setTitle(lang.sendTicket.embed.success.title)
            .setDescription(lang.sendTicket.embed.success.description)
            .setColor("Green")
            .setTimestamp();
        
        // -------------------
        //    SEND FEEDBACK
        // -------------------            

        interaction.reply({
            content: mention,
            embeds: [successEmbed],
            ephemeral: true
        });        
    }
};