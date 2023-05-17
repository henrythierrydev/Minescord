const fs = require('fs');
const managePresence = require('./events/status');
const { token } = require('./config.json');

const { Client, Collection } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const client = new Client({ intents: [1, 512, 32768, 2, 128]});

// -------------------
//    CMD REGISTER
// -------------------

client.commands = new Collection();
const commandFolders = fs.readdirSync('./commands');

for(const folder of commandFolders) 
{
    const folderFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));

    for(const file of folderFiles) 
    {
        const command = require(`./commands/${folder}/${file}`);

        if(command.data instanceof SlashCommandBuilder) {
            client.commands.set(command.data.name, command);
        }
    }
}

// -------------------
//      BOT LOAD
// -------------------

client.once('ready', async () => {
    const commandData = client.commands.map(command => command.data.toJSON());
    await client.application.commands.set(commandData);

    console.log(`[Minescord] => [v] Sucess => Logged in as ${client.user.tag}!`);
    console.log(`[Minescord] => [!] Alert => ${commandData.length} registered commands.`);
    console.log(`[Minescord] => [L] Log => Check project github for updates: https://github.com/Henry8K/Minescord`);

    managePresence(client);
});

// -------------------
//    BOT COMMANDS
// -------------------

client.on('interactionCreate', async interaction => 
{
    if(!interaction.isCommand()) return;
    if(!interaction.guild) return;

    const command = client.commands.get(interaction.commandName);

    if(!command) return;
    await command.execute(interaction).catch(console.error);
});

client.login(token);