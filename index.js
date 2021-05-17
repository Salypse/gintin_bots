const  Discord = require('discord.js')
const bot = new Discord.Client({ws: {intents: Discord.Intents.All}});
const fs = require("fs")
bot.commands = new Discord.Collection();

bot.once('ready', () => {
    console.log('Bot online')

    fs.readdir('./commands', (err, files) => {
        if(err) return console.log(err);

        let jsfile = files.filter(f => f.split(".").pop() == 'js');

        if (jsfile.length <= 0) return console.log("Could not find any commands!")

        jsfile.forEach(f => {
            let props = require(`./commands/${f}`);
            bot.commands.set(props.help.name, props)
        })
    })
})

bot.on('message', (message) => {
    if(message.author.bot) return;
    if(message.channel.type !== 'text') return;
    let prefix = '!';
    let MessageArray = message.content.split(' ');
    let cmd = MessageArray[0].slice(prefix.length)
    let args = MessageArray.slice(1)

    if(!message.content.startsWith(prefix)) return;

    let commandfile = bot.commands.get(cmd);
    if(commandfile)  {commandfile.run(bot,message,args)}
})

bot.on('guildMemberUpdate',  (oldMember, newMember) => {
    if(oldMember.nickname !== newMember.nickname) {
        newMember.send('You changed your nickname')
    }
})

bot.on('guildMemberAdd', (member) => {
   let embed = new Discord.MessageEmbed()
   .setTitle('Welcome to my server')
   .setDescription(`Thank you for joining my server!\n**Current Member Count:** ${member.guild.memberCount}\n**Owner:** ${member.guild.owner}`)
   .setColor('#34eb55')
   .setAuthor(member.guild.owner.user, member.guild.owner.user.avatarURL())
   .setFooter(member.guild.name, member.guild.iconURL())
   .setThumbnail(member.user.avatarURL());

   member.send(embed)
})
    
bot.login(process.env.token);