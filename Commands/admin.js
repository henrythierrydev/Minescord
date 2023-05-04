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
                .setImage("https://images7.alphacoders.com/110/1100122.jpg")
                .setDescription("👋 • Welcome to the **Minescord** Admin Panel, here you can manage your server in an easy and practical way.\n\n🔔 • Included Resources:\n\n1. **Ban**\n> Punish users who are breaking your server's rules.\n\n2.**Kick**\n> Remove annoying people from your server.\n\n3. **Broadcast**\n> Send a responsive embed as an ad in a channel you prefer!")

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
                        .setDescription('Use to broacast a embed in a channel')        
                );
                
            const components = new ActionRowBuilder()
                .addComponents(menu);
        
        //---------------------
        //     SEND EMBED
        // --------------------
        
        const userMention = interaction.user.toString();

        await interaction.reply({
            content: userMention,
            embeds: [configEmbed],
            components: [components]
        });

        //---------------------
        //     MODAL LIST
        // --------------------
        
        const actions = {
            'ban-option': {
                title: 'Ban User',
                inputs: [
                    { label: 'User ID', customId: 'ban-user-id', style: TextInputStyle.Short, placeholder: 'Add the user discord ID.' },
                    { label: 'Your ID', customId: 'ban-admin-id', style: TextInputStyle.Short, placeholder: 'Add your discord ID.' },
                    { label: 'Reason', customId: 'ban-reason-id', style: TextInputStyle.Short, placeholder: 'Add the ban reason' }
                ]
            },
            
            'kick-option': {
                title: 'Kick User',
                inputs: [
                    { label: 'User ID', customId: 'kick-user-id', style: TextInputStyle.Short, placeholder: 'Add the user discord ID.' },
                    { label: 'Your ID', customId: 'kick-admin-id', style: TextInputStyle.Short, placeholder: 'Add your discord ID.' },
                    { label: 'Reason', customId: 'kick-reason-id', style: TextInputStyle.Short, placeholder: 'Add the kick reason' }
                ]
            },

            'broadcast-option': {
                title: 'Send Broadcast',
                inputs: [
                    { label: 'Title', customId: 'br-title', style: TextInputStyle.Short, placeholder: 'Add the title of your broadcast.' },
                    { label: 'Description', customId: 'br-description', style: TextInputStyle.Paragraph, placeholder: 'Add the description of your broadcast.' },
                    { label: 'Color', customId: 'br-color', style: TextInputStyle.Short, placeholder: 'Example: #FF00FF' },
                    { label: 'Banner', customId: 'br-banner', style: TextInputStyle.Short, placeholder: 'Add a broadcast banner link' }
                ]
            }
        };

        //---------------------
        //  EMBED INTERACTION
        // --------------------        
        
        const collector = interaction.channel.createMessageComponentCollector({ filter: em => em.customId === 'panel-main' });
        
        collector.on('collect', async (em) => 
        {
            if(em.user.id !== interaction.user.id) 
            {
               const errorEmbed = new EmbedBuilder()
                   .setTimestamp()               
                   .setTitle("Error!")
                   .setColor("#f55a42")
                   .setDescription("❎ • Oops, you cannot interact on other users' interactions in progress");
                   
                   await interaction.reply({ embeds:[npembed], ephemeral: false });
                return;      
            }
        
            const action = actions[em.values[0]];
            if(!action) return;
          
            const modal = createModal(action.title, action.inputs);
            await em.showModal(modal);
        });

        //---------------------
        //    GENERATE MODAL
        // --------------------        
        
        function createModal(title, inputs) {
            const modal = new ModalBuilder().setCustomId(`${title.toLowerCase().replace(' ', '-')}-modal`).setTitle(title);
            
            inputs.forEach((input) => 
            {
                const row = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setLabel(input.label)
                        .setCustomId(input.customId)
                        .setStyle(input.style)
                        .setPlaceholder(input.placeholder)
                        .setRequired(true)
                );

              modal.addComponents(row);
            });

            return modal;
        }
          
        //---------------------
        //  MODAL INTERACTION
        // --------------------
    },
};