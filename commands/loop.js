module.exports.run = async (bot,message,args) => {
    if(!message.member.voice.channel) return message.channel.send("Please join a voice channel first!")

    let search = args.join(" ");

    if(!search) return message.channel.send('Please provide a search query')

    bot.player.play.loop(message, search)

    }


exports.help = {
    name: 'loop'
}