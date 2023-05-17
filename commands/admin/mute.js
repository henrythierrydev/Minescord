const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
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
        .setName(lang.mute.slash.name)
        .setDescription(lang.mute.slash.description)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

        .addUserOption(option => option.setName(lang.universal.slash.user.name)
            .setDescription(lang.universal.slash.user.description)
            .setRequired(true)        
        )

        .addStringOption(option => option.setName(lang.mute.slash.option.number.name)
            .setDescription(lang.mute.slash.option.number.description)
            .setRequired(true)
            .addChoices(
                { name: '1m', value: 'mute_1m' },
                { name: '5m', value: 'mute_5m' },
                { name: '10m', value: 'mute_10m' },
                { name: '1h', value: 'mute_1h' },
                { name: '1d', value: 'mute_1d' },
                { name: '7d', value: 'mute_7d' }
            )
        ),

    // -------------------
    //   COMMAND EXECUTE
    // -------------------

    async execute(interaction)
    {
        let muteTime = 0;
        const guild = interaction.guild;
        const ownerId = guild.ownerId;
        const mention = interaction.user.toString();
        const time = interaction.options.getString(lang.mute.slash.option.number.name);
        const user = interaction.options.getUser(lang.universal.slash.user.name);
        const userName = user.username;
        const member = guild.members.cache.get(user.id);
        const hasAdmin = member.roles.cache.some(role => role.permissions.has(PermissionFlagsBits.Administrator));        
        
        // -------------------
        //    COMMAND CHECK
        // -------------------

        if(!config.commands.mute) 
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
        //      BOT CHECK
        // -------------------

        if(user.bot) 
        {
            const errorBotEmbed = new EmbedBuilder()
                .setTitle(lang.universal.embeds.bot.title)
                .setDescription(lang.universal.embeds.bot.description)
                .setColor("Red")
                .setTimestamp();
                
                return interaction.reply({
                    content: mention,
                    embeds: [errorBotEmbed],
                    ephemeral: true
                }
            );
        }

        // -------------------
        //     ADMIN CHECK
        // -------------------

        if(hasAdmin || user.id === ownerId) 
        {
            const errorAdminEmbed = new EmbedBuilder()
                .setTitle(lang.mute.embed.admin.title)
                .setDescription(lang.mute.embed.admin.description)
                .setColor("Yellow")
                .setTimestamp();
                
                return interaction.reply({
                    content: mention,
                    embeds: [errorAdminEmbed],
                    ephemeral: true
                }
            );
        }        

        // -------------------
        //     TIME CHECK
        // -------------------
        
		switch(time) 
        {
            case 'mute_1m':
                muteTime = 60_000; 	
			break;

			case 'mute_5m':
                muteTime = 300_000;
			break;
			
            case 'mute_10m':
				muteTime = 600_000;
			break;

            case 'mute_1h':
                muteTime = 3_600_000;  
            break;

            case 'mute_1d':
                muteTime = 86_400_000;
            break;

            case 'mute_7d':
                muteTime = 604_800_000;
            break;

            default: 
                muteTime = 60_000;
            break;
		}

        // -------------------
        //     SUCESS LOCK
        // -------------------

        try 
        {
            await member.timeout(muteTime);

            // -------------------
            //     MUTE EMBED
            // -------------------

            const successEmbed = new EmbedBuilder()
                .setTitle(lang.mute.embed.muted.title)
                .setDescription(lang.mute.embed.muted.description.replace('{user_name}', userName))
                .setColor("Green")
                .setTimestamp();

            // -------------------
            //      MUTE SEND
            // -------------------                

            return interaction.reply({
                content: mention,
                embeds: [successEmbed],
                ephemeral: false
            });
        }

        catch(error)
        {
            // -------------------
            //   ERROR FEEDBACK
            // -------------------
        
            console.log(error);
            console.log("[Minescord] => [C] Critical => An unknown error occurred in the Mute command!");
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
    },
};