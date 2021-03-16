class Command {
    constructor(name, options = {}){

        const {
            aliases = [],
            ownerOnly = false,
            guildOnly = false,
            cooldown = 0,
            description = 'No description provided.',
            usage = 'No Usage provided',
            clientPermissions = [],
            userPermissions = [],
            ignoreCooldown = [],
            nsfw = false,
            args = []
        } = options;
        if(args) {
            if(!Array.isArray(args)) {
                throw new Error(`Args must be a array, invalid commands args at | ${name}`)
            } else {
                args.forEach((arg) => {
                    if(arg.prompt) throw new Error('No prompts for arg')
                    if(!arg.var) throw new Error('No var for arg')

                })
            }
        }
        this.usage = usage
        this.name = name
        this.aliases = aliases;
        this.ownerOnly = Boolean(ownerOnly);
        this.guildOnly = Boolean(guildOnly);
        this.cooldown = cooldown;
        this.description = Array.isArray(description) ? description.join('\n') : description;
        this.clientPermissions = typeof clientPermissions === 'function' ? clientPermissions.bind(this) : clientPermissions;
        this.userPermissions = userPermissions;
        this.nsfw = Boolean(nsfw)
        this.ignoreCooldown = typeof ignoreCooldown === 'function' ? ignoreCooldown.bind(this) : ignoreCooldown
    }
}

module.exports = Command