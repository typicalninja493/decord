class Command {
  constructor(name, options = {}) {
    const {
      aliases = [],
      dir = '',
      ownerOnly = false,
      category = 'general',
      guildOnly = false,
      cooldown = 3,
      description = 'No description provided.',
      usage = 'No Usage provided',
      clientPermissions = [],
      userPermissions = [],
      cooldownIgnored = [],
      nsfw = false,
    //  args = [],
    } = options;
    /*
    if (args) {
      if (!Array.isArray(args)) {
        throw new Error(
          `Args must be a array, invalid commands args at | ${name}`
        );
      }
      else {
        args.forEach((arg) => {
          if (arg.prompt) throw new Error("No prompts for arg");
          if (!arg.var) throw new Error("No var for arg");
        });
      }
    }*/

    this.usage = usage;
    this.dir = dir;
    this.category = category;
    this.name = name;
    this.aliases = aliases;
    this.ownerOnly = Boolean(ownerOnly);
    this.guildOnly = Boolean(guildOnly);
    this.cooldown = cooldown;
    this.description = Array.isArray(description)
      ? description.join('\n')
      : description;
    this.clientPermissions =
      typeof clientPermissions === 'function'
        ? clientPermissions.bind(this)
        : clientPermissions;
    this.userPermissions = userPermissions;
    this.nsfw = Boolean(nsfw);
    this.cooldownIgnored = cooldownIgnored;
  }
}

module.exports = Command;
