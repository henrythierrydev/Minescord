const config = require("../config.json");
let lang = config.lang || "en";

// -------------------
//   SUPPORTED LANGS
// -------------------

const languages = ["en", "es", "pt"];

// -------------------
//   SUPPORTED LANGS
// -------------------

if(!languages.includes(lang)) 
{
    console.log("[Minescord] => [C] Critical => Selected Language not found!");
    console.log("[Minescord] => [L] Log => Default language set to English!");
    lang = "en";
}

// -------------------
//   GET TRANSLATION
// -------------------

const commandLang = languages.reduce((acc, language) => {
    acc[language] = {
        commands: require(`./translations/${language}`)
    };

    return acc;
}, {});

// -------------------
//   RETURN THE LANG
// -------------------

function getTranslation() {
    return commandLang[lang].commands;
}

module.exports = { getTranslation };