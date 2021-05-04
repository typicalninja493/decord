const ValidationError = require('./struct/ValidationError');
const fs = require('fs');
const Command = require('../src/struct/commands');
const Plugin = require('../src/struct/plugin');
/**
 * The Validator for options
 * Handles the options validation given by a user
 * @param {options} options - Options for The validator
 * Both options for d.js and decord can be used in the same place, decord options will be taken from the given options and rest is passed to d.js
 */
class Validator {
    constructor(options = {}) {
        this.options = options;
    }
  async validateOptions(options) {
   if(!options.eventsPath) options.eventsPath = './events';
   if(!options.commandsPath) options.eventsPath = './ecommands';

    if(options.ownerID && !Array.isArray(options.ownerID)) {
      throw new ValidationError(`ownerID must be A Array, Got ${typeof options.ownerID}`);
    }

    if(options.commandsPath) {
        if(typeof options.commandsPath !== 'string') {
            throw new ValidationError(`commandsPath must be A String, Got ${typeof options.commandsPath}`);
        }

        if(!fs.existsSync(options.commandsPath)) {
            throw new ValidationError(`commandsPath ${options.commandsPath} Does not exist `);
        }
    }
  if(options.eventsPath) {
    if(typeof options.eventsPath !== 'string') {
        throw new ValidationError(`eventsPath must be A String, Got ${typeof options.eventsPath}`);
    }
  /*
    if(!fs.existsSync(options.eventsPath)) {
        throw new ValidationError(`eventsPath ${options.eventsPath} Does not exist `)
    }*/
  }


  }
   /**
     * Validate each of the command instance provided
     * @param {command} command - The command instance
     */
  async validateCommands(command) {
    if(!(command instanceof Command)) {
      throw new ValidationError('command Must be a extended class of Command');
    }
    if(isNaN(command.cooldown)) {
      throw new ValidationError('Command Cool-down Must be a Number');
    }
    if(!Array.isArray(command.aliases)) {
      throw new ValidationError('aliases must be a array');
    }
    if(!command.dir) throw new ValidationError('Need the dir param');
/*
    if(!command.group) throw new ValidationError('Need the group param');
    if(typeof command.group !== 'string') throw new ValidationError('Group param must be a string');
*/
    if(!fs.existsSync(command.dir)) throw new ValidationError(`Command dir ${command.dir} does not exists`);

  }
  validatePlugins(pluginIN) {
    if(!(pluginIN instanceof Plugin)) {
      throw new ValidationError('plugin Must be a extended class of Plugin');
    }
    if(!pluginIN.name) {
      throw new ValidationError('Name is needed for plugins');
    }

    // TODO: Have more checks
  }
  validateEvents(event) {
    if(!event.event) {
      throw new ValidationError('event missing');
    }
    if(!event.execute) {
      throw new ValidationError('execute is a needed value for events');
    }
    if(typeof event.execute !== 'function') {
      throw new ValidationError(`execute must be a function, received ${typeof event.execute}`);
    }
  }
}

module.exports = Validator;