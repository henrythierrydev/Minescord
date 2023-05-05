const en = {
    messages: require("./Messages/english"),
    commands: require("./Commands/english"),
};

const es = {
    messages: require("./Messages/spanish"),
    commands: require("./Commands/spanish"),
};

const pt = {
    messages: require("./Messages/portuguese"),
    commands: require("./Commands/portuguese"),
};
  
const languages = { en, es, pt };
const config = require("../config.json");
const lang = config.lang || "en";

// =================
//   GET MESSAGES
// =================

function getMessages() {
    return languages[lang].messages;
}

// =================
//   GET COMMANDS
// =================

function getCommands() {
    return languages[lang].commands;
}

module.exports = { getMessages, getCommands };