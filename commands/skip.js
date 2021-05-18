module.exports.run = {
    name: "skip",

    async run (bot, message, args) {
        if(!message.member.voice.channel) return message.channel.send("Please join a voice channel first!")

        client.player.skip(message);
    }
}