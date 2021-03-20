module.exports = {
    event: 'ready',
     once: true,
 async execute(client) {
console.log(`Ready! Logged in as ${client.user.tag}`);

if(client.status) {
    if(client.status.statuses) {
        if(Array.isArray(client.status.statuses)) {
            const activities = client.status.statuses;
            const interval = client.status.interval || '15000';
            let i = 0;
            setInterval(() => client.user.setActivity(`${activities[i++ % activities.length]}`, { type: client.status.type ? client.status.type : 'WATCHING' }).catch(console.error), interval);
        }
        else if(typeof client.status.statuses == 'string') {

            await client.user.setActivity(client.status.statuses, { type: client.status.type ? client.status.type : 'WATCHING' }).catch(console.error);
        }
    }

}
 },
};