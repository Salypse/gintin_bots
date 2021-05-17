const  Discord = require('discord.js')

module.exports.run = async (bot,message,args) => {
        let member = message.mentions.members.first();
        if(!member) { message.channel.send('Bye');} else {
          message.channel.send(`Bye ${member.user}`)
        }
}
module.exports.run = {
name: 'bye'
}