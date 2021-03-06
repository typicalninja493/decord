// Credit: (formatTime) : https://github.com/Androz2091/discord-giveaways
const Opts = {
	remove: '🗑️',
	reaction: ['⬅️', '➡️'],
};
const { stripIndent } = require('common-tags');

async function formatTime(time) {
    const roundTowardsZero = time > 0 ? Math.floor : Math.ceil;

    const days = roundTowardsZero(time / 86400000),
        hours = roundTowardsZero(time / 3600000) % 24,
        minutes = roundTowardsZero(time / 60000) % 60;
    let seconds = roundTowardsZero(time / 1000) % 60;

    if (seconds === 0) seconds++;

    const isDay = days > 0,
        isHour = hours > 0,
        isMinute = minutes > 0;
    const dayUnit =
            days < 2 ? 'day' : 'days',
        hourUnit =
            hours < 2 ? 'hour' : 'hours',
        minuteUnit =
            minutes < 2 ? 'minute' : 'minutes',
        secondUnit =
            seconds < 2 ? 'second' : 'seconds';
    // Generates a first pattern
    const pattern =
        (!isDay ? '' : `{days} ${dayUnit}, `) +
        (!isHour ? '' : `{hours} ${hourUnit}, `) +
        (!isMinute ? '' : `{minutes} ${minuteUnit}, `) +
        `{seconds} ${secondUnit}`;
    // Format the pattern with the right values
    const m = '{duration}';
    const content = m
    .replace('{duration}', pattern)
    .replace('{days}', days.toString())
    .replace('{hours}', hours.toString())
    .replace('{minutes}', minutes.toString())
    .replace('{seconds}', seconds.toString());
return content;
}

/** Check if a node-module is installed on the system or not */
async function packageExist(package) {
    try {
        require.resolve(package);
    }
    catch(err) {
       return false;
    }
return true;
}

function clean(text, client) {
    if (typeof (text) === 'string') {
        return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203)).replace(client.token, '****N**o***T*O*K*E*N***F*O*R***Y*O*U');
    }

    else {
        return text;
    }
  }


/**
 * Paginate a given array of strings
 * @param {message} message - The message
 * @param {array} textArray - A array of strings to paginate
 */
async function paginate(message, textArray, type = 'normal') {
const pages = [...textArray];
let page = 0;

for (let i = 0; i < pages.length; i++) {
    pages[i] = stripIndent`\`${i + 1}\`/\`${pages.length}\`\n${type == 'error' ? '`Error`' : ''}\n\`\`\`js\n${pages[i]}\`\`\` ${i + 1 == pages.length ? '' : 'And more...'}`;
}

const msg = type == 'error' ? await message.author.send(pages[page]) : await message.channel.send(pages[page]);

const reactions = {};

if (pages.length > 1) {
    reactions.left = await msg.react(Opts.reaction[0]).catch((err) => console.log(err));
    reactions.right = await msg.react(Opts.reaction[1]).catch((err) => console.log(err));
    reactions.remove = await msg.react(Opts.remove).catch((err) => console.log(err));

}
if(!reactions.remove) return;


const filter = (reaction, user) => {
	return user.id === message.author.id;
};

const collector = await msg.createReactionCollector(filter, { time: 60000 });

collector.on('collect', async (reaction, user) => {

if(reaction.emoji.toString() === reactions.remove.emoji.toString()) {
collector.stop('DELETE');
return;
}
else if (reaction.emoji.toString() == reactions.left.emoji.toString()) {
    if (pages[page - 1]) {
        page--;

        await msg.edit(pages[page]).catch();
    }
}
else if (reaction.emoji.toString() == reactions.right.emoji.toString()) {
    if (pages[page + 1]) {
        page++;

        await msg.edit(pages[page]).catch();
    }
}
await reaction.users.remove(user.id).catch();

});

collector.on('end', async (collected, reason) => {
    if (reason != 'DELETE') {
        for (const reaction of Object.values(reactions)) {
            await reaction.remove().catch();
        }
    }

    if (reason == 'DELETE') await msg.delete();
});
}

// paginate credits: https://github.com/XzFirzal/discord-paginator.js/blob/master/index.js


/**
 * parse a mention in a string, 1 string at a time
 * @param {String} content - The mention used to get the user from
 * @param {Client} client - The client.
 * @returns {User}
 */
async function parseMentions(content, client) {
 if(!content) return false;

    if (content.startsWith('<@') && content.endsWith('>')) {
		content = content.slice(2, -1);

		if (content.startsWith('!')) {
			content = content.slice(1);
		}
    let user = client.users.cache.get(content);

    if(!user) {
        user = client.users.fetch(content).catch(() => false);
    }

		return user;
	}
}

module.exports = {
    formatTime,
    packageExist,
    clean,
    paginate,
    parseMentions,
};