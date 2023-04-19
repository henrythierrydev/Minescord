const token = require('./secrets/token');
const managePresence = require('./status/manage');
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMembers] });

// ========================
//        BOT READY
// ========================
// Part of the code executed only the bot is executed.

client.once('ready', () => {
    console.log("[SUCESS] Bot has started running!");
    managePresence(client);
});

// ========================
//        BOT TOKEN
// ========================
// You can change the token by accessing the 'Secret' folder and then in token.json

client.login(token.token);