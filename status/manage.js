const { ActivityType } = require('discord.js');
const config = require('../resources/status.json');

// ====================
//     BOT PRESENCE
// ====================
// This function automate Discord's status system so you don't need to change it in code.

async function managePresence(client) {
    const { presences, status } = config;
    let currentActivityIndex = 0;
  
    client.user.setStatus(status);
  
    function setNextActivity() {
      const activity = presences[currentActivityIndex];
      const description = activity.description;
  
      client.user.setActivity(description, {
        type: ActivityType[activity.type]
      });
  
      currentActivityIndex = (currentActivityIndex + 1) % presences.length;
  
      setTimeout(() => {
        setNextActivity();
      }, activity.interval);
    }
  
    setNextActivity();
}

module.exports = managePresence;