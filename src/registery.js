const fs = require('fs').promises;
const path = require('path');
const validator = require('../src/validator')
const valid = new validator()
// where commands and events get added to the client



class Register {
    constructor() {
      
    }
  async registerCommands(pathTOFile, collection, client, ignoredcommands = {}) {
    let files = await fs.readdir(pathTOFile);

    for(let file of files) {
      let stat = await fs.lstat(path.join(pathTOFile, file));

      if(stat.isDirectory()) {
        this.registerCommands(path.join(pathTOFile, file), collection);
      } else {
        if(file.endsWith(".js")) {
          let commandName = file.substring(0, file.indexOf(".js"));

          
          if(ignoredcommands[commandName] == false) {
          client.emit('update', `[Register] => Command ${commandName} Was ignored`)
            return;
          }

          try {
            let cmdModule = require(path.join(pathTOFile, file));
            
            let cmd = new cmdModule(client)

          await valid.validateCommands(cmd, client)

       

           collection.set(commandName, cmd)
           client.emit('commandLoaded', commandName)
           client.emit('update', `[Register] => Command ${commandName} Loaded`)

          } catch(err) {
             
            client.emit('commandLoadError', commandName, err)
            client.emit('update', `[Register] => Command ${commandName} Failed to load`)
          }
        }
      }
     

    }
  }
  async registerEvents(pathTOFile, client, ignoredEvents = {}) {
    let files = await fs.readdir(pathTOFile);

    for(let file of files) {
      let stat = await fs.lstat(path.join(pathTOFile, file));

      if(stat.isDirectory()) {
        this.registerEvents(path.join(pathTOFile, file), client);
      } else {
        if(file.endsWith(".js")) {
          let eventName = file.substring(0, file.indexOf(".js"));
        
          if(ignoredEvents[eventName] == false) {
            client.emit('update', `[Register] => event ${eventName} Was ignored`)
            return;
          }

          try {
            let event = require(path.join(pathTOFile, file));
            
        
         //  valid.validateEvents(event)

         client.on(eventName, event.bind(null, client));

         client.emit('eventLoaded', eventName)
         client.emit('update', `[Register] => event ${eventName} Loaded`)

          } catch(err) {
            client.emit('eventLoadError', eventName, err)
            client.emit('update', `[Register] => event ${eventName} Failed to load`)
          }
        }
      }
     

    }
  }
  async registerPlugins(filePath, Plugin, client, ignoredPlugins) {

    let files = await fs.readdir(filePath);

    for(let file of files) {
      let stat = await fs.lstat(path.join(filePath, file));

      if(stat.isDirectory()) {
        this.registerPlugins(path.join(filePath, file), Plugin, ignoredPlugins);
      } else {
        if(file.endsWith(".js")) {
          let pluginName = file.substring(0, file.indexOf(".js"));
        
          if(ignoredPlugins[pluginName] == false) {
            client.emit('update', `[Register] => plugin ${pluginName} Was ignored`)
            return;
          }

          try {
            let plugin = require(path.join(filePath, file));
            
    const pluginIN = new plugin()
    
          valid.validatePlugins(pluginIN)

          await pluginIN.Load(client)

          Plugin.set(pluginIN.name, pluginIN)

         client.emit('eventLoaded', pluginName)
         client.emit('update', `[Register] => event ${pluginName} Loaded`)

          } catch(err) {
            client.emit('eventLoadError', pluginName, err)
            client.emit('update', `[Register] => event ${pluginName} Failed to load`)
          }
        }
      }

    }



  }

}

module.exports = Register;