const Command = require('../../struct/commands');
const { version } = require('../../../index');
const Discord = require('discord.js');
const { formatTime, clean, paginate, parseMentions } = require('../../../src/utils');
const { stripIndent } = require('common-tags');
const process = require('child_process');


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
           
            ${message.client.user.username} has been up for \`${await formatTime(message.client.uptime)}\`. Using \`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\` Of Ram.
            ${message.client.Commands.size} Commands loaded ,  ${message.client.ownerID ? typeof message.client.ownerID == 'string' ? '`1` Owner Registered' : `\`${message.client.ownerID.length}\` Owners Registered` : 'No owners Registered' }.
            Prefix registered as \`${prefix}\`

            ${message.client.user.username} is ${message.client.shard ? 'Sharded' : 'Not sharded'} And is in \`${message.client.guilds.cache.size}\` ${message.client.guilds.cache.size > 1 ? 'Guilds' : 'Guild'}
            Average websocket latency: \`${message.client.ws.ping}\`
            `;
             return message.channel.send(string);
          }
          else if(args[0].toLowerCase() === 'eval') {
            const code = args.slice(1).join(' ');
            if(!code) {
          return message.channel.send(stripIndent`
            \`\`\`diff
            - !decord eval <args>
            -               ^^^^

            - Args is a needed value that is missing
            \`\`\`
            `);
          }
          try {
            let evaled = await eval(`( async () => {
              ${code}
            })()`);

            if (typeof evaled !== 'string') {
              evaled = require('util').inspect(evaled);
            }

            if(evaled.length < 500) {
              return message.channel.send(clean(evaled, message.client), { code:'xl' });
            }
            else {
              const evaledCleaned = clean(evaled, message.client);
              const t = evaledCleaned.match(/(.|[\r\n]){1,500}/g);
              await paginate(message, t);
            }
          }
          catch(err) {
            if(err.length < 200) {
              return message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err, message.client)}\n\`\`\``);
            }
            const errTostrin = err.toString();
            const et = errTostrin.match(/(.|[\r\n]){1,500}/g);
            await paginate(message, et, 'error');
          }
          } 
          else if(args[0].toLowerCase() === 'execute' || args[0].toLowerCase() === 'console') {
            const code = args.slice(1).join(' ');
            if(!code) {
          return message.channel.send(stripIndent`
            \`\`\`diff
            - !decord execute <args>
            -               ^^^^

            - Args is a needed value that is missing
            \`\`\`
            `);
          }
            process.exec(code, async (error, stdout) => {
              const response = (error || stdout);
              const t = response.match(/(.|[\r\n]){1,500}/g);

              await paginate(message, t);
          });
          }
          else if(args[0].toLowerCase() === 'reload') {
            const commandName = args[1];
            const command =
              message.client.commands.get(commandName) ||
              message.client.commands.find(
                (cmd) => cmd.aliases && cmd.aliases.includes(commandName),
              );
            if (!command) {
              return message.channel.send(
                `There is no command with name or alias \`${commandName}\`, ${message.author}!`,
              );
            }
    try {
      delete require.cache[
        require.resolve(`${command.dir}/${command.name}`)
      ];
      const newCommand = require(`${command.dir}/${
        command.name
      }`);
      message.client.commands.set(newCommand.name, newCommand);
      message.channel.send(
        `Reloaded Command **${command.name}** located at \`commands/${command.name}.js\``,
      );
    }
    catch (error) {
      message.channel.send(
        `There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``,
      );
    }
          }
          else {
            return message.channel.send(`\`${args[0]}\` Is not a valid sub-command`);
          }
        }
};