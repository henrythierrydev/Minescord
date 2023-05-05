const en = require("./en.json");
const br = require("./br.json");
const es = require("./es.json");
const config = require ("../config.json");

function getLanguage() {
    let lang = config.lang || "en";
    
    switch (lang) {
        case "en":
        return en;

        case "br":
        return br;

        case "es":
        return es;

        default:
        return en;
    }
}

module.exports = getLanguage;