module.exports = {
    version: require('./package.json').version,
    Client: require('./src/client.js'),
    Command: require('./src/struct/commands.js'),
    Plugin: require('./src/struct/plugin.js'),
    util: require('./src/utils'),
};