import json
import discord
import asyncio

async def updatePresence(bot):
    await bot.wait_until_ready()

    with open('Resources/status.json') as file:
        status_data = json.load(file)

    guild = bot.get_guild(status_data['guild_id'])

    if guild == None:
        print('Error! Guild not found, update your status.json')
        return

    while not bot.is_closed():
        for update in status_data['status_updates']:
            activity_type = discord.ActivityType[update['activity_type'].lower()]
            activity_name = update['activity_name']
            update_interval = update['update_interval']

            members_count = guild.member_count
            activity_name = activity_name.replace('{members}', str(members_count))

            activity = discord.Activity(type=activity_type, name=activity_name)
            await bot.change_presence(activity=activity)

            await asyncio.sleep(update_interval)