const { EmbedBuilder, PermissionFlagsBits, ChannelType, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const { getTranslation } = require('../../languages/controller');
const lang = getTranslation(); 

const data = require('../../resources/embeds.json');

module.exports =
{
    // -------------------
    //    SLASH BUILDER
    // -------------------

    data: new SlashCommandBuilder()
        .setName(lang.sendTicket.slash.name)
        .setDescription(lang.sendTicket.slash.description)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        
        .addChannelOption(option => option.setName(lang.universal.slash.channel.name)
            .setDescription(lang.universal.slash.channel.description)
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        ),

    // -------------------
    //   COMMAND EXECUTE
    // -------------------

    async execute(interaction)
    {
        const mention = interaction.user.toString();
        const channelID = interaction.options.getChannel(lang.universal.slash.channel.name).id;
        const channel = interaction.client.channels.cache.get(channelID);

        // -------------------
        //    EMBED CHECK
        // -------------------

        if (Object.values(data.tickets.send.embed).concat(Object.values(data.tickets.send.button)).includes('')) 
        {
            const incompleteEmbed = new EmbedBuilder()
                .setTitle(lang.sendTicket.embed.incomplete.title)
                .setDescription(lang.sendTicket.embed.incomplete.description)
                .setColor("Red")
                .setTimestamp();
                
            return interaction.reply({
                content: mention,
                embeds: [incompleteEmbed],
                ephemeral: true
            });
        }

        // -------------------
        //     TICKET EMBED
        // -------------------
        
        const ticketEmbed = new EmbedBuilder()
            .setTitle(data.tickets.send.embed.title)
            .setDescription(data.tickets.send.embed.description)
            .setColor(data.tickets.send.embed.color)
            .setImage(data.tickets.send.embed.banner);

        // -------------------
        //    TICKET BUTTON
        // -------------------

        const ticketButton = new ButtonBuilder()
            .setCustomId("ct")
            .setLabel(data.tickets.send.button.label)
            .setEmoji(data.tickets.send.button.emoji)
            .setStyle(ButtonStyle.Secondary);

        // -------------------
        //    SEND INTERACT
        // -------------------

        const components = [new ActionRowBuilder().addComponents(ticketButton)];

        channel.send({
            embeds: [ticketEmbed],
            components: components
        });

        // -------------------
        //    SUCCESS EMBED
        // -------------------
        
        const successEmbed = new EmbedBuilder()
            .setTitle(lang.sendTicket.embed.success.title)
            .setDescription(lang.sendTicket.embed.success.description.replace('{channel_id}', `<#${channel.id}>`))
            .setColor("Green")
            .setTimestamp();
    
        return interaction.reply({
            content: mention,
            embeds: [successEmbed],
            ephemeral: false
        });
    },
};