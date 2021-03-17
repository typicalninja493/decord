const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');


module.exports  = {
    event: 'message',
    execute(message, client) {
if(message.author.bot) return;
if(client.guildOnly && !message.channel.guild) return;

const prefix = client.getPrefix(message) || '!'

const prefixRegex = new RegExp(`^(<@!?${message.client.user.id}>|${escapeRegex(prefix)})\\s*`);

if(!prefixRegex.test(message.content)) return;

const [, matchedPrefix] = message.content.match(prefixRegex);

const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
const command = args.shift().toLowerCase();

const cmd = client.Commands.get(command)

if(!cmd) return;


if(cmd.userPermissions && cmd.userPermissions.length > 0) {
    if(message.guild) {
        const check = (permission) => message.member.hasPermission(permission);


        if(!cmd.userPermissions.some(check)) {
            return message.channel.send(`You are missing Permission's for this command! You need \`${cmd.userPermissions.join(', ')}\``) //todo : Customizable message : low priority
        }
    } else {
 return message.channel.send(`This command can only be excuted in a guild`)
    }
  
}

if(cmd.ownerOnly && !message.client.ownerID.includes(message.author.id)) return message.channel.send('Command is bot owner only!!')

if(cmd.nsfw && !message.channel.nsfw) return message.channel.send('This command can only be used in a nsfw channel!!')



try {
    cmd.execute(message, args);
} catch (error) {
console.error(error);
message.reply('there was an error trying to execute that command!');
}
    }
    } 