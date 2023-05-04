const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { PermissionsBitField } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

// ===================
//   COMMAND BUILDER
// ===================
// Function to build the slash command syntax

module.exports = {
    data: new SlashCommandBuilder()
        .setName('admin')
        .setDescription('[Admin] General bot admin responsive panel'),
        
        async execute(interaction) 
        {
            //---------------------
            //   CHECK PERMISSION
            // --------------------

            const member = interaction.member;
    
            if(!member.permissions.has(PermissionsBitField.Flags.KickMembers)) 
            {

                const npembed = new EmbedBuilder()
                   .setTimestamp()               
                   .setTitle("Error!")
                   .setColor("#f55a42")
                   .setDescription("❎ • Oops, it looks like you don't have permission to execute this command! Only administrators can do it!");

                   await interaction.reply({ embeds:[npembed], ephemeral: false });
                return;
            }

            //---------------------
            //    CREATE EMBED
            // --------------------

            const configEmbed = new EmbedBuilder()
                .setTimestamp()
                .setColor("Random")
                .setTitle("Admin Panel")
                .setDescription("👋 • Welcome to the **Minescord** Admin Panel, here you can manage your server in an easy and practical way.\n\n🔔 • Included Resources:\n\n1. **Ban**\n> Punish users who are breaking your server's rules.\n\n2.**Kick**\n> Remove annoying people from your server.\n\n3. **Broadcast**\n> Send a responsive embed as an ad in a channel you prefer!")
                .setImage("https://images7.alphacoders.com/110/1100122.jpg")

            //---------------------
            //     CREATE MENU
            // --------------------
            
            const menu = new StringSelectMenuBuilder()
                .setCustomId('panel-main')
                .setPlaceholder('Select one of the options')
                
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setEmoji("🔒")
                        .setLabel('Ban')
                        .setValue('ban-option')
                        .setDescription('Use to ban a user from your server'),
                    
                    new StringSelectMenuOptionBuilder()
                        .setEmoji("🔐")
                        .setLabel('Kick')
                        .setValue('kick-option')
                        .setDescription('Use to kick a user from your server'),

                    new StringSelectMenuOptionBuilder()
                        .setEmoji("📢")
                        .setLabel('Broadcast')
                        .setValue('broadcast-option')
                        .setDescription('Use to broacast a embed in a channel'),
                );

        const components = new ActionRowBuilder().addComponents(menu);                

        //---------------------
        //    SEND MESSAGE
        // --------------------

        const userMention = interaction.user.toString();

        await interaction.reply({
            content: userMention,
            embeds: [configEmbed],
            components: [components],
            ephemeral: false
        });

        //---------------------
        //  EMBED INTERACTION
        // --------------------
        
        const filter = em => em.customId === 'panel-main';
        const collector = interaction.channel.createMessageComponentCollector({ filter });
        
        collector.on('collect', async em =>
        {        
            if(em.customId === 'panel-main' && em.user.id === interaction.user.id) 
            {
                //---------------------
                //     BAN COMMAND
                // --------------------

                if(em.values[0] === 'ban-option') 
                {
                    const banModal = new ModalBuilder()
                        .setCustomId('bmodal')
                        .setTitle('Ban User');

                    const userID = new TextInputBuilder()
                        .setMinLength(18)
                        .setMaxLength(18)
                        .setLabel("User ID")
                        .setCustomId('ban-user-id')
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder('Add the user discord ID.')
                        .setRequired(true);
        
                    const adminID = new TextInputBuilder()
                        .setMinLength(18)
                        .setMaxLength(18)
                        .setLabel("Your ID")
                        .setCustomId('ban-admin-id')
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder('Add your discord ID.')
                        .setRequired(true);

                    const input1 = new ActionRowBuilder().addComponents(userID);
                    const input2 = new ActionRowBuilder().addComponents(adminID);

                    banModal.addComponents(input1, input2);
                    await em.showModal(banModal);
                }

                //---------------------
                //     KICK COMMAND
                // --------------------

                if(em.values[0] === 'kick-option') 
                {
                    const kickModal = new ModalBuilder()
                        .setCustomId('kmodal')
                        .setTitle('Kick User');

                    const userID = new TextInputBuilder()
                        .setMinLength(18)
                        .setMaxLength(18)
                        .setLabel("User ID")
                        .setCustomId('kick-user-id')
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder('Add the user discord ID.')
                        .setRequired(true);
        
                    const adminID = new TextInputBuilder()
                        .setMinLength(18)
                        .setMaxLength(18)
                        .setLabel("Your ID")
                        .setCustomId('kick-admin-id')
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder('Add your discord ID.')
                        .setRequired(true);

                    const input1 = new ActionRowBuilder().addComponents(userID);
                    const input2 = new ActionRowBuilder().addComponents(adminID);

                    kickModal.addComponents(input1, input2);
                    await em.showModal(kickModal);
                }

                //---------------------
                //  BROADCAST COMMAND
                // --------------------
                
                if(em.values[0] === 'broadcast-option') 
                {
                    const BroadcastModal = new ModalBuilder()
                        .setCustomId('bmmodal')
                        .setTitle('Send Broadcast');

                    const brTitle = new TextInputBuilder()
                        .setMinLength(5)
                        .setLabel("Title")
                        .setCustomId('br-title')
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder('Add the title of your broadcast.')
                        .setRequired(true);
        
                    const brDescription = new TextInputBuilder()
                        .setMinLength(20)
                        .setLabel("Description")
                        .setCustomId('br-description')
                        .setStyle(TextInputStyle.Paragraph)
                        .setPlaceholder('Add the description of your broadcast.')
                        .setRequired(true);

                    const brColor = new TextInputBuilder()
                        .setMinLength(20)
                        .setLabel("Color")
                        .setCustomId('br-color')
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder('Example: #FF00FF')
                        .setRequired(true);

                    const brBanner = new TextInputBuilder()
                        .setLabel("Description")
                        .setCustomId('br-color')
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder('Add a broadcast banner link');                        

                    const input1 = new ActionRowBuilder().addComponents(brTitle);
                    const input2 = new ActionRowBuilder().addComponents(brDescription);
                    const input3 = new ActionRowBuilder().addComponents(brColor);
                    const input4 = new ActionRowBuilder().addComponents(brBanner);

                    BroadcastModal.addComponents(input1, input2, input3, input4);
                    await em.showModal(BroadcastModal);
                }                
            }
        });

        //---------------------
        //  MODAL INTERACTION
        // --------------------        
    },
};