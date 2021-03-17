const Command = require('../../../src/struct/commands')


module.exports = class pingCommand  extends Command {
    constructor(client) {
      
        super('decode', {
          aliases: ['manager'],
          description: 'default manager',
          ownerOnly: true,

          userPermissions: ['ADD_REACTIONS', 'MANAGE_MESSAGES']
          
        })
    }
      
        execute(message, args) {
     message.channel.send(`> ${args.join(' ')}`)
        }
}