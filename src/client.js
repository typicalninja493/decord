const Discord = require("discord.js");
const validator = require("../src/validator");
const valid = new validator();
const Register = require("../src/registery");
const fs = require("fs");
const path = require("path");
const register = new Register();

class Client extends Discord.Client {
  constructor(options = {}) {
    super(options);
    valid.validateOptions(options);
    this.prefix = options.prefix ? options.prefix : "!";
    this.getPrefix =
      options.getPrefix && typeof options.getPrefix == "function"
        ? options.getPrefix
        : (m) => this.prefix;
    this.ownerID = options.ownerID ? options.ownerID : [];
    this.commandsPath = options.commandsPath
      ? options.commandsPath
      : "../src/default/commands";
    this.eventsPath = options.eventsPath
      ? options.eventsPath
      : "../src/default/events";
    this.Commands = new Discord.Collection();
    this.Plugins = new Discord.Collection();
    this.cooldowns = new Discord.Collection();
    this.guildOnly = options.guildOnly || false;

    this.status = options.status

    /*
    if(fs.existsSync(this.eventsPath)) {
        try {
            registerCommands(this.eventsPath)
        } catch(err) {
            this.emit('registerFail', err)
      this.emit('update', '[Client] => event register failed to register')
        }
    }*/
  }
  registerCommands(
    filePath = this.commandsPath,
    client = this,
    ignoredCommands = []
  ) {
    if (!fs.existsSync(filePath))
      throw new Error(`Path ${filePath} for commands was not found`);

    try {
      this.emit(
        "update",
        `[Client] => Command register starting register for path ${filePath}`
      );
      register.registerCommands(
        filePath,
        this.Commands,
        client,
        ignoredCommands,
      );
    }
    catch (err) {
      this.emit('registerFail', err);
      this.emit(
        'update',
        `[Client] => Command register failed to register all commands in dir ${filePath}`,
      );
      return true;
    }

    // Register all the events using the path given
  }
  registerEvents(filePath = this.eventsPath, client = this) {
    if(!fs.existsSync(filePath)) {
// path does not exist
      throw new Error(`Path ${filePath} for events was not found`);
    } 

    try {
      this.emit(
        "update",
        `[Client] => events register starting register for path ${filePath}`
      );
      register.registerEvents(filePath, client);
    } catch (err) {
      this.emit("registerFail", err);
      this.emit(
        "update",
        `[Client] => Events register failed to register commands in dir ${filePath}`
      );
    }
    return true;
  }

  registerDefaultCommands(client, ignoredcommands = {}) {
    const filePath = path.join(__dirname, "/default/commands");
    if (typeof ignoredcommands !== "object" && ignoredcommands !== null) {
      throw new Error("Ignored cmds must be a object");
    }
    try {
      this.emit(
        "update",
        `[Client] => Command register starting To register Default commands`
      );
      register.registerCommands(
        filePath,
        this.Commands,
        client,
        ignoredcommands
      );
    } catch (err) {
      this.emit("registerFail", err);
      this.emit(
        "update",
        `[Client] => Command register failed to register Default commands in dir ${filePath}`
      );
    }
    return true;
  }

  registerDefaultEvents(client, ignoredEvents = {}) {
    const filePath = path.join(__dirname, "/default/events");
    if (typeof ignoredEvents !== "object" && ignoredEvents !== null) {
      throw new Error("Ignored Events must be a object");
    }

    try {
      this.emit(
        "update",
        `[Client] => events register starting register default events`
      );
      register.registerEvents(filePath, client, ignoredEvents);
    } catch (err) {
      this.emit("registerFail", err);
      this.emit(
        "update",
        `[Client] => Events register failed to register commands in dir ${filePath}`
      );
    }
    return true;
  }
  loadPlugins(filePath, client, ignoredPlugins = {}) {
    if (!fs.existsSync(filePath))
      throw new Error(`Path ${filePath} for plugins was not found`); // path does not exist
    if (typeof ignoredPlugins !== "object" && ignoredPlugins !== null) {
      throw new Error("Ignored Events must be a object");
    }

    try {
      this.emit(
        "update",
        `[Client] => plugins register starting register plugins`
      );
      register.registerPlugins(filePath, this.Plugins, client, ignoredPlugins);
    } catch (err) {
      this.emit("registerFail", err);
      this.emit(
        "update",
        `[Client] => Events register failed to register commands in dir ${filePath}`
      );
    }
    return true;
  }
  registerControllers(pathToFile, ignoredControllers = {}) {}
}

module.exports = Client;
