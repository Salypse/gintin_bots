const Discord = require("discord.js")

module.exports.run = async (bot,message,args) => {
    const messageToSay = args.join(" ");
    const sayEmbed = new Discord.MessageEmbed()
    .setTitle(`${message.authoer.tag} says: ${messageToSay}`)
    .setFooter(message.author.tag ,message.author.displayAvatarURL())
    .setColor("#c334eb")
    .setTimestamp()
    try{
        await message.channel.send(sayEmbed);
    } catch (err) {
        console.log(err);
        message.channel.send('I am not able to say that message');
    }
}
exports.help = {
name: 'say'
}