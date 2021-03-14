class Plugin {
    constructor(name, options = {}){

        const {
            version = '1.0',
            event = 'ready',
            versionRepo = `https://github.com`,        //! Check if a valid url
            repo = ''
        } = options;
        
       this.version = version;
       this.event = event
       this.versionRepo = versionRepo
       this.repo = repo
       this.name = name
    }
    async Load(){
        return true
    }
async Unload() {
    return true
}
async action(client){
    return console.log('[Warn] - you have a plugin which do not modify the action() function!!')
}
}

module.exports = Plugin