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
        } = options;
        
        this.name = name
        this.aliases = aliases;
        this.ownerOnly = Boolean(ownerOnly);
        this.guildOnly = Boolean(guildOnly);
        this.cooldown = cooldown;
        this.description = Array.isArray(description) ? description.join('\n') : description;
        this.clientPermissions = typeof clientPermissions === 'function' ? clientPermissions.bind(this) : clientPermissions;
        this.userPermissions = typeof userPermissions === 'function' ? userPermissions.bind(this) : userPermissions;
        this.nsfw = Boolean(nsfw)
        this.ignoreCooldown = typeof ignoreCooldown === 'function' ? ignoreCooldown.bind(this) : ignoreCooldown
    }
}

module.exports = Command