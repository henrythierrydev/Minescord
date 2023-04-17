import json
import discord
import asyncio

# ==================
#     BOT STATUS
# ==================
# this function gets bot json and sets status based on configuration!

async def updatePresence(bot):
    # Wait until the bot is ready to begin updating its presence
    await bot.wait_until_ready()
    
    # Load status data from status.json
    with open('Resources/status.json') as file:
        status_data = json.load(file)
       
    # Get the guild object for the specified guild ID
    guild = bot.get_guild(status_data['guild_id'])
    
    # If the specified guild ID is invalid, send an error message and exit
    if guild == None:
        print('Error! Guild not found. Please update your status.json file.')
        return
    
    # Continuously update the bot's presence according to the contents of status.json
    while not bot.is_closed():
        # Iterate over each status update defined in status.json
        for update in status_data['status_updates']:
            # Extract the relevant fields from the status update
            activity_type = discord.ActivityType[update['activity_type'].lower()]
            activity_name = update['activity_name']
            update_interval = update['update_interval']

            # Replace '{members}' in the activity name with the actual member count
            members_count = guild.member_count
            activity_name = activity_name.replace('{members}', str(members_count))

            # Update the bot's presence with the new activity
            activity = discord.Activity(type=activity_type, name=activity_name)
            await bot.change_presence(activity=activity)

            # Wait for the specified interval before updating the bot's presence again
            await asyncio.sleep(update_interval)
            
# End of update status code.