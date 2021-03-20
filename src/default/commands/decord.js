const Command = require('../../struct/commands');
const { version } = require('../../../index');
const Discord = require('discord.js');
const { formatTime } = require('../../../src/utils');
const { stripIndent } = require('common-tags');

module.exports = class pingCommand extends Command {
    constructor() {
        super('decord', {
          aliases: ['manager'],
          description: 'default manager',
          ownerOnly: true,
          dir: __dirname,
          userPermissions: ['ADD_REACTIONS', 'MANAGE_MESSAGES'],
        });
    }
       async execute(message, args) {
         const prefix = message.client.getPrefix(message);
          if(!args[0]) {

             const string = stripIndent`
             Running Decord version \`${version}\`, Discord.js version \`${Discord.version}\`. Node.js version \`${process.version}\`
             on \`${process.platform}\`
           
            ${message.client.user.username} has been up for \`${await formatTime(message.client.uptime)}\`.Using \`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\` Ram.
            ${message.client.Commands.size} Commands loaded,  ${message.client.ownerID ? typeof message.client.ownerID == 'string' ? '`1` Owner Registered' : `\`${message.client.ownerID.length}\` Owners Registered` : 'No owners Registered' }.
            Prefix registered as \`${prefix}\`

            ${message.client.user.username} is ${message.client.shard ? 'Sharded' : 'Not sharded'} And is in \`${message.client.guilds.cache.size}\` ${message.client.guilds.cache.size > 1 ? 'Guilds' : 'Guild'}
            Average websocket latency: \`${message.client.ws.ping}\`
            `;
             return message.channel.send(string);
          }
     message.channel.send(`> ${args.join(' ')}`);
        }
};