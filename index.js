const  Discord = require('discord.js')
const bot = new Discord.Client()
const fs = require("fs")
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
const Distube = require('distube')
//const config = require('.config.json')

module.exports.run = async(bot, messsage, args) => {}

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

const distube = new DisTube(client, { searchSongs: true, emitNewSongOnly: true });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(config.prefix)) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift();

    if (command == "play")
        distube.play(message, args.join(" "));

    if (["repeat", "loop"].includes(command))
        distube.setRepeatMode(message, parseInt(args[0]));

    if (command == "stop") {
        distube.stop(message);
        message.channel.send("Stopped the music!");
    }

    if (command == "skip")
        distube.skip(message);

    if (command == "queue") {
        let queue = distube.getQueue(message);
        message.channel.send('Current queue:\n' + queue.songs.map((song, id) =>
            `**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``
        ).slice(0, 10).join("\n"));
    }

    if ([`3d`, `bassboost`, `echo`, `karaoke`, `nightcore`, `vaporwave`].includes(command)) {
        let filter = distube.setFilter(message, command);
        message.channel.send("Current queue filter: " + (filter || "Off"));
    }
});


    
bot.login(process.env.token);