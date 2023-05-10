const config = require("../config.json");
let lang = config.lang || "en";

// -------------------
//   SUPPORTED LANGS
// -------------------

const languages = ["pt", "es"];

// -------------------
//   LANG NOT FOUND
// -------------------

if(!languages.includes(lang)) 
{
    console.log("[Minescord] => [C] Critical => Selected Language not found!");
    console.log("[Minescord] => [L] Log => Default language set to English!");
    lang = "en";
}

// -------------------
//      GET FILE
// -------------------
// Get and return de file of the translation

const commandLang = languages.reduce((acc, language) => 
{
    acc[language] = {
        commands: require(`./translations/${language}`)
    };

    return acc;
}, {});

// -------------------
//    RETURN LANG
// -------------------

function getTranslation() {
    return commandLang[lang].commands;
}

module.exports = { getTranslation };