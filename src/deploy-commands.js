require('dotenv').config();
const { REST, Routes } = require('discord.js');
const { buildCommands } = require('./commands/definitions');
const logger = require('./utils/logger');

function restClient() {
  const token = process.env.DISCORD_TOKEN;
  const clientId = process.env.CLIENT_ID;
  if (!token || !clientId) throw new Error('DISCORD_TOKEN and CLIENT_ID are required to register slash commands.');
  return { rest: new REST({ version: '10' }).setToken(token), clientId };
}

async function deployToGuild(guildId) {
  const { rest, clientId } = restClient();
  const body = buildCommands();
  await rest.put(Routes.applicationGuildCommands(clientId, String(guildId).trim()), { body });
  logger.info('Registered ' + body.length + ' commands in guild ' + guildId);
}

async function deployGlobal() {
  const { rest, clientId } = restClient();
  const body = buildCommands();
  await rest.put(Routes.applicationCommands(clientId), { body });
  logger.info('Registered ' + body.length + ' global commands: ' + body.map((c) => c.name).join(', '));
}

async function deployCommands(client) {
  const body = buildCommands();
  logger.info('Command list: ' + body.map((c) => c.name).join(', '));
  try { await deployGlobal(); } catch (err) { logger.warn('Global command deploy failed: ' + err.message); }
  if (client && client.guilds && client.guilds.cache) {
    for (const guild of client.guilds.cache.values()) {
      try { await deployToGuild(guild.id); }
      catch (err) { logger.warn('Could not register commands in ' + guild.id + ': ' + err.message); }
    }
  }
}

module.exports = { deployCommands, deployToGuild, deployGlobal };
