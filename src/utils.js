// Credit: (formatTime) : https://github.com/Androz2091/discord-giveaways

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

function clean(text) {
    if (typeof (text) === 'string') {
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    }

    else {
        return text;
    }
  }

module.exports = {
    formatTime,
    packageExist,
    clean,
};