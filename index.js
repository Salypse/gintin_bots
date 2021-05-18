const  Discord = require('discord.js')
const bot = new Discord.Client({ws: {intents: Discord.Intents.All}});
const fs = require("fs")
bot.commands = new Discord.Collection();

module.exports.run = async(bot, msssage, args) => {}

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


const Discord = require('discord.js');
const client = new Discord.Client();
const {prefix, token} = require("./config.json")

var queue = new Map();

const Discord = require('discord.js');
const client = new Discord.Client();
const {prefix, token} = require("./config.json")

var queue = new Map();

const ytdl = require('ytdl-core');

client.on('ready', () => console.log("ready"));

client.on('message', async (message) => {
    if(message.author.bot) return;
    if(message.content.indexOf(prefix) !== 0) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command == "play") {
        if(!args[0]) return;
        let url = args.join(" ");
        if(!url.match(/(youtube.com|youtu.be)\/(watch)?(\?v=)?(\S+)?/)) return message.channel.send("Please provide a valid Youtube link!");

        let serverQueue = queue.get(message.guild.id);
        let vc = message.member.voice;

        if(!vc) return message.channel.send("You are not in a voice channel!");

        if(!vc.channel.permissionsFor(client.user).has('CONNECT') || !vc.channel.permissionsFor(client.user).has('SPEAK')) return message.channel.send("I do not have permission!");

        let songinfo = await ytdl.getInfo(url);
        let song = {
            title: songinfo.title,
            url: songinfo.video_url
        }

        if(!serverQueue) {
            let queueConst = {
                textChannel: message.channel,
                voiceChannel: vc.channel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true
            };

            queue.set(message.guild.id, queueConst);
            queueConst.songs.push(song);

            try {
                let connection = await vc.channel.join();
                queueConst.connection = connection
                playSong(message.guild, queueConst.songs[0])
            } catch (error) {
                console.log(error);
                queue.delete(message.guild.id);
                return message.channel.send("There was an error playing the song! Error: " + error);
            }
        } else {
            serverQueue.songs.push(song);
            return message.channel.send(`${song.title} has been added to the queue!`)
        }
    }
})

/**
 * 
 * @param {Discord.Guild} guild 
 * @param {Object} song 
 */
async function playSong(guild, song) {
    let serverQueue = queue.get(guild.id);

    if(!song){
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection.play(ytdl(song.url)).on('end', () => {
        serverQueue.songs.shift();
        playSong(guild, serverQueue.songs[0]);
    })
    .on('error', () => {
        console.log(error)
    })

    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}
    
bot.login(process.env.token);