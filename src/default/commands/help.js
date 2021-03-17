const Command = require("../../../src/struct/commands");
const Discord = require("discord.js");

module.exports = class pingCommand extends Command {
  constructor(client) {
    super("help", {
      description: "default help command",

      userPermissions: ["ADD_REACTIONS", "MANAGE_MESSAGES"],
    });
  }

  execute(message, args) {
    const gembed = new Discord.MessageEmbed().setTitle(
      `${message.client.user.username}'s help`
    );
    if (!args[0]) {
      const commands = message.client.Commands.map(
        (c) => `${c.name} - ${c.description}`
      ).join("\n ");
      gembed.setDescription(commands);
      return message.channel.send(gembed);
    }
  }
};
