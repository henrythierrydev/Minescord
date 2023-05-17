const { EmbedBuilder, ChannelType, PermissionFlagsBits, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const config = require('../../resources/config.json');
const { getTranslation } = require('../../languages/controller');
const lang = getTranslation();

module.exports = 
{
    // -------------------
    //    SLASH BUILDER
    // -------------------

    data: new SlashCommandBuilder()
        .setName(lang.announcement.slash.name)
        .setDescription(lang.announcement.slash.description)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

        .addChannelOption(option => option.setName(lang.announcement.slash.option.channel.name)
            .setDescription(lang.announcement.slash.option.channel.description)
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )

        .addMentionableOption(option => option.setName(lang.announcement.slash.option.mention.name)
            .setDescription(lang.announcement.slash.option.mention.description)
            .setRequired(true)
        ),

    // -------------------
    //   COMMAND BUILDER
    // -------------------

    async execute(interaction) 
    {
        const channel = interaction.options.getChannel(lang.announcement.slash.option.channel.name);
        const mention = interaction.options.getMentionable(lang.announcement.slash.option.mention.name).toString();
        const authorMention = interaction.user.toString();

        // -------------------
        //    COMMAND CHECK
        // -------------------

        if(!config.commands.announcement)
        {
            const unavailableCommand = new EmbedBuilder()
                .setTitle(lang.universal.embeds.unavailable.title)
                .setDescription(lang.universal.embeds.unavailable.description)
                .setColor("Red")
                .setTimestamp();

            return interaction.reply({
                content: authorMention,
                embeds: [unavailableCommand],
                ephemeral: true
            });
        }

        // -------------------
        //    MODAL BUILDER
        // -------------------
        
        const announcementModal = new ModalBuilder()
            .setCustomId("announcement-modal")
            .setTitle(lang.announcement.modal.main_title);
            
            // -------------------
            //     TITLE INPUT
            // -------------------
            
            const titleInput = new TextInputBuilder()
                .setCustomId("title-input")
                .setLabel(lang.announcement.modal.title.label)
                .setPlaceholder(lang.announcement.modal.title.placeholder)
                .setMinLength(10)
                .setMaxLength(100)
                .setStyle(TextInputStyle.Short);

            // -------------------
            //  DESCRIPTION INPUT
            // -------------------                 
                
            const descriptionInput = new TextInputBuilder()
                .setCustomId("description-input")
                .setLabel(lang.announcement.modal.description.label)
                .setPlaceholder(lang.announcement.modal.description.placeholder)
                .setMinLength(20)
                .setMaxLength(500)
                .setStyle(TextInputStyle.Paragraph);

            // -------------------
            //    BANNER INPUT
            // -------------------                 

            const bannerInput = new TextInputBuilder()
                .setCustomId("banner-input")
                .setLabel(lang.announcement.modal.banner.label)
                .setPlaceholder(lang.announcement.modal.banner.placeholder)
                .setStyle(TextInputStyle.Short);

            // -------------------
            //     BUILD ROWS
            // -------------------
                
            const row1 = new ActionRowBuilder().addComponents(titleInput);
            const row2 = new ActionRowBuilder().addComponents(descriptionInput);
            const row3 = new ActionRowBuilder().addComponents(bannerInput);
            
            announcementModal.addComponents(row1, row2, row3);
            await interaction.showModal(announcementModal);

        // -------------------
        //    MODAL VALUES
        // -------------------        

        const filter = (interaction) => interaction.customId === 'announcement-modal';
        interaction.awaitModalSubmit({ filter, time: 0 })
        
        .then(interaction => 
        {
            const title = interaction.fields.getTextInputValue('title-input');
            const description = interaction.fields.getTextInputValue('description-input');
            const banner = interaction.fields.getTextInputValue('banner-input');

            // -------------------
            //    BANNER CHECK
            // -------------------
        
            if(banner === "https://" || !/^https:\/\/[\w.\/-]+$/.test(banner) || !/\.(png|jpeg|webp)$/i.test(banner))
            {
                const linkEmbed = new EmbedBuilder()
                    .setTitle(lang.announcement.embed.link.title)
                    .setDescription(lang.announcement.embed.link.description)
                    .setColor("Red")
                    .setTimestamp();
                    
                return interaction.reply({
                    content: authorMention,
                    embeds: [linkEmbed],
                    ephemeral: true
                });
            }
            
            // -------------------
            //    EMBED BUILDER
            // -------------------        
            
            const announceEmbed = new EmbedBuilder()
                .setTitle(title)
            
                .setDescription(description
                    .replace(/{line}/g, '\n')
                    .replace(/{line}{line}/g, '\n\n'))

                .setImage(banner)
                .setColor("Green");
                
            // -------------------
            //    SUCCESS EMBED
            // -------------------
            
            try
            {
                channel.send({
                    content: mention,
                    embeds: [announceEmbed]
                });
                
                const successEmbed = new EmbedBuilder()
                    .setTitle(lang.announcement.embed.send.title)
                    .setDescription(lang.announcement.embed.send.description.replace('{announcement_channel}', channel))
                    .setColor("Green")
                    .setTimestamp();
                    
                    return interaction.reply({
                        content: mention,
                        embeds: [successEmbed],
                        ephemeral: true
                    });
                }
    
                catch(error)
                {
                    // -------------------
                    //   ERROR FEEDBACK
                    // -------------------
                
                    console.log(error);
                    console.log("[Minescord] => [C] Critical => An unknown error occurred in the Announcement command!");
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
            })

        .catch(err => console.log(""));
    }
};