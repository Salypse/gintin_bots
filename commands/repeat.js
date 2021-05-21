const  Discord = require('discord.js')
const distube = require('distube')

module.exports.run = async (bot,message,args) => {
  distube.setRepeatMode(message, parseInt(args[0]));

}
exports.help = {
  name: 'repeat'
}