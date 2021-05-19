let { RichEmbed } = require('discord.js')
const config = require('../../config.json')

exports.run = async(bot, message, args) => {
  const serverQueue = client.queue.get(msg.guild.id);
  if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
  if(!serverQueue) return msg.channel.send('Not playing anything right now');
  if(serverQueue.voiceChannel.id !== msg.member.voiceChannel.id) return msg.channel.send(`You must be in **${serverQueue.voiceChannel.name}** to loop the queue`);
  serverQueue.loop = !serverQueue.loop;
  client.queue.set(msg.guild.id, serverQueue);
  if(serverQueue.loop) return msg.channel.send('**🔁 Repeated current queue!**');
  return msg.channel.send('**🔁 Unrepeated current queue!**');
}




exports.conf = {
    aliases: ['loop'],
    cooldown: "3"
}