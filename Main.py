import asyncio
import discord
import Status.update
from discord.ext import commands

intents = discord.Intents.default()
bot = commands.Bot(command_prefix='!', intents=intents)

# ==================
#    BOT STATUS
# ==================
# to change the bot status go to 'Status' folder.

@bot.event
async def on_ready():
    await Status.update.updateStatus(bot)

bot.run('');