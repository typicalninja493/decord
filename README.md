### Decord

* What is decord? 

 #### Decord is a yet another frame-work for [discord.js](https://discord.js.org/), this was inspired by [akiro](https://www.npmjs.com/package/discord-akairo)

 This in beta!!

## Usage

* This package is not yet released to npm, `index.js` is the main file of the package (will be renamed to the package name when released)

```
const { Client } = require('./index') 
const path = require('path')
// client is extended from discord.client

const client = new Client() // normal client options and decord options


client.registerCommands(path.join(__dirname, './commands'), client) // register commands


client.registerDefaultCommands(client) // register the default commands


client.registerDefaultEvents(client) // register the default events decord provides

client.loadPlugins('./plugins', client) // load plugins if you have any


client.login('YOUR_TOKEN_HERE') // login as usual

```

### Methods 

```registerDefaultEvents(parameters)``` - Register the default events 
 > Parameters: `client` - **Your discord client ex: (client)**

```loadPlugins(parameters)``` - Load the plugins in a directory
> Parameters : `Path to your file, client` - **ex : ('./plugin', client)**


```registerCommands(parameters)``` 






### Events file

* This is how you events file should look like :

```
module.exports = {
    event: 'event_name',
     once: if event should be .on or .once
 execute(event_parameters, client) {

// code here 

 }
};
```


##### Explanation

`event` - the event this should run, ex: ready
`once` - set to true if its should be run on client.once
`execute` - must be a function, where your code is, 
 > parameters for execute are parameters for the event your listening for + client at the end

 ### Example

 * ready event

 ``` 

 module.exports = {
    event: 'ready',
     once: true,
 execute(client) {
console.log(`Ready! Logged in as ${client.user.tag}`);
 
 }
};
```


### Ignoring commands/events/plugins

* All the events to register a default event/ default command/command/event has a parameter named ignored${type}, you can use this to skip over events you don't need or, use it for debugging to see if a certain event is the issue without removing code or file

* As a example we here is how to disable a event (here built in ready)


```
client.registerDefaultEvents(client, [
    ready: false
])
```