
// not yet ready

async function getResponse(message, prompts = []) {
if(!Array.isArray(prompts)) throw new Error('Need to be a array to get a response')
const filter = m => m.author.id == message.author.id
for(let i = 0; i < prompts.length; i++) {
    await message.channel.send(prompts[i].prompt)
const response = await message.channel.awaitMessages(filter, { max: 1})
}
}