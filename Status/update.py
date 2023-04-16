import asyncio
import discord

async def updateStatus(bot):
    await bot.wait_until_ready()
    
    while not bot.is_closed():
        guild = bot.get_guild(1096944900941029510)
        members = len(guild.members)
        
        await asyncio.sleep(20)
        await bot.change_presence(activity=discord.Game(name="jogar.minecket.net"))
        
        await bot.change_presence(activity=discord.Activity(type=discord.ActivityType.watching, name=f"{members} membros!"))
        await asyncio.sleep(20)