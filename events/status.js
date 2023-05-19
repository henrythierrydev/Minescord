const { ActivityType } = require('discord.js');
const config = require('../resources/status.json');
  
async function managePresence(client) 
{
    const { presences, status } = config;
    let currentActivityIndex = 0;

    client.user.setStatus(status);
    
    function setNextActivity() {
        const activity = presences[currentActivityIndex];
        const { description, type, interval } = activity;

        client.user.setActivity(description, {
            type: ActivityType[type]
        });    
        currentActivityIndex = (currentActivityIndex + 1) % presences.length;

        setTimeout(() => {
            setNextActivity();
        }, interval);
    }
    setNextActivity();
}

module.exports = managePresence;