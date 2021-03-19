const Command = require('../../../src/struct/commands');
const Discord = require('discord.js');

module.exports = class pingCommand extends Command {
  constructor() {
    super('help', {
      description: 'default help command',

      userPermissions: ['ADD_REACTIONS', 'MANAGE_MESSAGES'],
    });
  }

  execute(message, args) {
    const gembed = new Discord.MessageEmbed().setTitle(
      `${message.client.user.username}'s help`,
    )
    .setColor('GREEN');
    if (!args[0]) {
      let commands = message.client.Commands.map(
        (c) => `${c.name} - ${c.description}`,
      ).join('\n');

       if(!message.client.ownerID.includes(message.author.id)) {
        commands = message.client.Commands.filter(c => !c.ownerOnly).map(
          (c) => `${c.name} - ${c.description}`,
        ).join('\n');
       }

      gembed.setDescription(commands);
      return message.channel.send(gembed);
    }
    else {
   const cmd = args[0].toLowerCase();
   const command = message.client.Commands.get(cmd) || message.client.Commands.find(c => c.aliases && c.aliases.includes(command));
   if(!command) return message.channel.send(`A command named \`${cmd}\` was not found`);
if(command.ownerOnly && !message.client.ownerID.includes(message.author.id)) return message.channel.send(`A command named \`${cmd}\` was not found`);
   const string = `
   ------- Help info for \`${command.name}\` -------\n
   \`\`\`
   Description: ${command.description}
   Usage: ${command.usage}
   GuildOnly: ${command.guildOnly ? 'Yes' : 'No'}
   category: ${command.category}
   Permissions: ${command.userPermissions > 0 ? command.userPermissions.join(', ') : 'None' }
   \`\`\`
   ------------------------------------------
   `;
   return message.channel.send(string);
    }
  }
};
