const fs = require('fs');
const managePresence = require('./Events/status.js');
const { token, guild_id } = require('./config.json');
const { Client, Collection } = require('discord.js');
const client = new Client({ intents: [1, 512, 32768, 2, 128] });

// ================
//     COMMANDS
// ================
// Function to verify and create new bot commands folder.

client.commands = new Collection();
const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js'));

for(const file of commandFiles) {
    const command = require(`./Commands/${file}`);
    client.commands.set(command.data.name, command);
}

// ================
//    BOT READY
// ================
// Function that executes every that the bot starts.

client.on('ready', async () => 
{
    const guildId = guild_id;
    const commandData = client.commands.map(command => command.data.toJSON());
    await client.application.commands.set(commandData, guildId);

    console.log(`[Minescord] => [v] Sucess => Logged in as ${client.user.tag}!`);
    console.log(`[Minescord] => [!] Alert => ${commandData.length} registred commands.`);
    console.log(`[Minescord] => [L] Log => Check project github for updates: https://github.com/Henry8K/Minescord`);

    managePresence(client);
});

// =================
//   SLASH COMMAND
// =================
// Funtion to create and verify the bot slash commands

client.on('interactionCreate', async interaction => 
{
    if(!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if(!command) return;
    await command.execute(interaction).catch(console.error);
});

client.login(token);
