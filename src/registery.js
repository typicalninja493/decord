const fs = require('fs').promises;
const path = require('path');
const validator = require('../src/validator');
const valid = new validator();
// where commands and events get added to the client


class Register {
    constructor() {

    }
  async registerCommands(pathTOFile, collection, client, ignoredcommands = {}) {
    const files = await fs.readdir(pathTOFile);

    for(const file of files) {
      const stat = await fs.lstat(path.join(pathTOFile, file));

      if(stat.isDirectory()) {
        this.registerCommands(path.join(pathTOFile, file), collection);
      }
 else if(file.endsWith('.js')) {
          const commandName = file.substring(0, file.indexOf('.js'));


          if(ignoredcommands[commandName] == false) {
          client.emit('update', `[Register] => Command ${commandName} Was ignored`);
            return;
          }

          try {
            const cmdModule = require(path.join(pathTOFile, file));

            const cmd = new cmdModule(client);

          await valid.validateCommands(cmd, client);


           collection.set(commandName, cmd);
           client.emit('commandLoaded', commandName);
           client.emit('update', `[Register] => Command ${commandName} Loaded`);

          }
 catch(err) {

            client.emit('commandLoadError', commandName, err);
            client.emit('update', `[Register] => Command ${commandName} Failed to load`);
          }
        }


    }
  }
  async registerEvents(pathTOFile, client, ignoredEvents = {}) {
    const files = await fs.readdir(pathTOFile);

    for(const file of files) {
      const stat = await fs.lstat(path.join(pathTOFile, file));

      if(stat.isDirectory()) {
        this.registerEvents(path.join(pathTOFile, file), client);
      }
 else if(file.endsWith('.js')) {
          const eventName = file.substring(0, file.indexOf('.js'));

          if(ignoredEvents[eventName] == false) {
            client.emit('update', `[Register] => event ${eventName} Was ignored`);
            return;
          }

          try {
            const event = require(path.join(pathTOFile, file));


         valid.validateEvents(event);


         if(event.execute && typeof event.execute == 'function') {
          if(event.once) {
            client.once(event.event, (...args) => event.execute(...args, client));
          }
 else {
          client.on(event.event, (...args) => event.execute(...args, client));
          }
        }


         client.emit('eventLoaded', eventName);
         client.emit('update', `[Register] => event ${eventName} Loaded`);

          }
 catch(err) {
            client.emit('eventLoadError', eventName, err);
            client.emit('update', `[Register] => event ${eventName} Failed to load`);
          }
        }


    }
  }
  async registerPlugins(filePath, Plugin, client, ignoredPlugins) {

    const files = await fs.readdir(filePath);

    for(const file of files) {
      const stat = await fs.lstat(path.join(filePath, file));

      if(stat.isDirectory()) {
        this.registerPlugins(path.join(filePath, file), Plugin, ignoredPlugins);
      }
 else if(file.endsWith('.js')) {
          const pluginName = file.substring(0, file.indexOf('.js'));

          if(ignoredPlugins[pluginName] == false) {
            client.emit('update', `[Register] => plugin ${pluginName} Was ignored`);
            return;
          }

          try {
            const plugin = require(path.join(filePath, file));

    const pluginIN = new plugin();

          valid.validatePlugins(pluginIN);

          await pluginIN.Load(client);

          Plugin.set(pluginIN.name, pluginIN);

         client.emit('pluginLoaded', pluginName);
         client.emit('update', `[Register] => plugin ${pluginName} Loaded`);

          }
 catch(err) {
            client.emit('pluginLoadError', pluginName, err);
            client.emit('update', `[Register] => plugin ${pluginName} Failed to load`);
          }
        }

    }


  }

}

module.exports = Register;