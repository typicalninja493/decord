const ValidationError = require('./struct/ValidationError')
const fs = require('fs')
const Command = require('../src/struct/commands')
const Plugin = require('../src/struct/plugin')
class Validator {
    constructor(options = {}) {
        this.options = options
    }
  async validateOptions(options) {
   if(!options.eventsPath) options.eventsPath = './commands'
   if(!options.commandsPath) options.eventsPath = './events'

      
    if(options.ownerID && !Array.isArray(options.ownerID)) {
      throw new ValidationError(`ownerID must be A Array, Got ${typeof options.ownerID}`)
    }

    if(options.commandsPath) {
        if(typeof options.commandsPath !== 'string') {
            throw new ValidationError(`commandsPath must be A String, Got ${typeof options.commandsPath}`)
        }
      
        if(!fs.existsSync(options.commandsPath)) {
            throw new ValidationError(`commandsPath ${options.commandsPath} Does not exist `)
        }
    }
  if(options.eventsPath) {
    if(typeof options.eventsPath !== 'string') {
        throw new ValidationError(`eventsPath must be A String, Got ${typeof options.eventsPath}`)
    }
  /*
    if(!fs.existsSync(options.eventsPath)) {
        throw new ValidationError(`eventsPath ${options.eventsPath} Does not exist `)
    }*/
  }

   
  }

  async validateCommands(command) { 
    if(!(command instanceof Command)) {
      throw new ValidationError(`command Must be a extended class of Command`)
    }
   
    if(isNaN(command.cooldown)) {
      throw new ValidationError(`Command Cool-down Must be a Number`)
    }
    if(!Array.isArray(command.aliases)) {
      throw new ValidationError(`aliases must be a array`)
    }
    if(!Array.isArray(command.ignoreCooldown) && typeof command.ignoreCooldown !== 'function') {
      throw new ValidationError(`ignoreCooldown must be a array of user id's`)
    }
  }
  validatePlugins(pluginIN) {
    if(!(pluginIN instanceof Plugin)) {
      throw new ValidationError(`plugin Must be a extended class of Plugin`)
    }
    if(!pluginIN.name) {
      throw new ValidationError(`Name is needed for plugins`)
    }

    //TODO: Have more checks
  }

}

module.exports = Validator;