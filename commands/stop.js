module.exports.run = async (bot,message,args) => {

    if(!message.member.voice.channel) return message.channel.send("Please join a voice channel first!")

    client.player.stop(message);
    
    }

exports.help = {
    name: 'mute'
}
    
