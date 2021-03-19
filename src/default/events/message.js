const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const Discord = require('discord.js');

module.exports = {
    event: 'message',
    execute(message, client) {
if(message.author.bot) return;
if(client.guildOnly && !message.channel.guild) return;

const { cooldowns } = message.client;


const prefix = client.getPrefix(message) || '!';

const prefixRegex = new RegExp(`^(<@!?${message.client.user.id}>|${escapeRegex(prefix)})\\s*`);

if(!prefixRegex.test(message.content)) return;

const [, matchedPrefix] = message.content.match(prefixRegex);

const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
const command = args.shift().toLowerCase();

const cmd = client.Commands.get(command) || client.Commands.find(c => c.aliases && c.aliases.includes(command));

if(!cmd) return;

if (!cooldowns.has(cmd.name)) {
	cooldowns.set(cmd.name, new Discord.Collection());
}

const now = Date.now();
const timestamps = cooldowns.get(cmd.name);
const cooldownAmount = (cmd.cooldown || 3) * 1000;


if (timestamps.has(message.author.id) && !message.client.ownerID.includes(message.author.id)) {
	const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

	if (now < expirationTime) {
		const timeLeft = (expirationTime - now) / 1000;
		return message.channel.send(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${cmd.name}\` command.`);
	}
}

if(cmd.userPermissions && cmd.userPermissions.length > 0 && !message.client.ownerID.includes(message.author.id)) {
    if(message.guild) {
        const check = (permission) => message.member.hasPermission(permission);


        if(!cmd.userPermissions.some(check)) {
            return message.channel.send(`You are missing Permission's for this command! You need \`${cmd.userPermissions.join(', ')}\``);
             // Todo : Customizable message : low priority
        }
    }
    else {

 return message.channel.send('This command can only be excuted in a guild');
    }
}

if(cmd.ownerOnly && !message.client.ownerID.includes(message.author.id)) return message.channel.send('Command is bot owner only!!');

if(cmd.nsfw && !message.channel.nsfw) return message.channel.send('This command can only be used in a nsfw channel!!');


timestamps.set(message.author.id, now);
setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
try {
    cmd.execute(message, args);
}
catch (error) {
console.error(`The following error ocurred while executing command ${cmd.name} | in ${message.guild.name} | args : ${args} | err: ${error}`);
message.reply(`❌ | An error occurred while executing ${cmd.name}`);
}
},
};