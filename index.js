const express = require('express');
const app = express();

const Discord = require('discord.js');
const client = new Discord.Client();
const cmd = require('node-cmd');
const config = require('./config.json');
const db = require('quick.db');
const ms = require("ms");
const fs = require('fs');
const ytdl = require("ytdl-core");
const { Slash } = require("discord-slash");
const canvas = require("canvas");
const convert = require("hh-mm-ss");
const fetchVideoInfo = require("youtube-info");
const simpleytapi = require('simple-youtube-api');
const util = require("util");
const gif = require("gif-search");
const jimp = require("jimp");
const guild = require('guild');
const hastebins = require('hastebin-gen');
const getYoutubeID = require('get-youtube-id');
const pretty = require("pretty-ms");
const moment = require('moment');
const request = require('request');
const dateFormat = require('dateformat');
const message = require('discord-reply');                 
const prefix = (config.PREFIX);

/*
--> Ready Settings
*/
client.on("ready", () => { 
  console.log("------------------------------------")
  console.log(`Logged in as > ${client.user.tag}`)
  console.log(`All Servers > ${client.guilds.cache.size}`)
  console.log(`All Users > ${client.users.cache.size}`)
  console.log("------------------------------------")
  console.log(`Prefix > ${prefix}`)
  console.log(`Client ID > ${client.user.id}`)
  console.log(`Bot Developer > ArbawiStudio#1333`)
  console.log("------------------------------------")
  console.log(`Support Server > https://discord.gg/3Zaxc3EaYt`)
  client.user.setActivity(`${prefix}help | Bot By ArbawiStudio`)
}); 

/*
--> Owner Commands
*/
const developers = ["779034600415428608"];
client.on("message", (message) => {
  if (!developers.includes(message.author.id)) return;
  if (message.content.startsWith(prefix + "setwatching")) {
    client.user.setActivity(`${prefix}help`, { type: "WATCHING" });
    message.reply("Done\n  Now Activity is WATCHING  ");
  }
  if (message.content == prefix + "setlistening") {
    client.user.setActivity(`${prefix}help`, { type: "LISTENING" });
    message.reply("Done\n  Now Activity is LISTENING ");
  }
  if (message.content == prefix + "setplaying") {
    client.user.setActivity(`${prefix}help`, { type: "PLAYING" });
    message.reply("Done\n  Now Activity is PLAYING  ");
  }
  if (message.content == prefix + "setstreaming") {
    client.user.setActivity(`${prefix}help`, { type: "STREAMING", url: "https://www.twitch.tv/tapoze"});
    message.reply("Done\n  Now Activity is STREAMING ");
}
}); 

/*----------------
> Google Assistant
------------------*/

const discordTTS = require("discord-tts");
client.on("message", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;
  if (message.content.toLowerCase().startsWith(prefix+ `talk`)) {
    if (!message.member.voice.channel) return message.reply(`Baka`);
    const broadcast = client.voice.createBroadcast();
    const connection = await message.member.voice.channel.join();
    var args = message.content.split(" ").slice(1).join(" ");
    broadcast.play(discordTTS.getVoiceStream(args));
    connection.play(broadcast);
message.react(`✅`);
  }
});

/*------------
> Badges of User
--------------*/

client.on("message", async(djs) => {
    if (djs.content.startsWith(prefix + 'badges')) {
        var member = djs.mentions.users.first() || client.users.cache.get(djs.content.split(' ')[1]) || djs.author
        const flags = member.flags || await member.fetchFlags();
        await db.set(`${member.id}`, [])
        if (flags.toArray().includes('DISCORD_PARTNER')) db.push(`${member.id}`, "<:Partner:875309572682842152>")
        if (flags.toArray().includes('HYPESQUAD_EVENTS')) db.push(`${member.id}`, "<:Events:875309573123219467>");
        if (flags.toArray().includes('HOUSE_BRILLIANCE')) db.push(`${member.id}`, "<:Brilliance:875309575098732574>");
        if (flags.toArray().includes('HOUSE_BRAVERY')) db.push(`${member.id}`, "<:BraveryLogo:875309574276661279>");
        if (flags.toArray().includes('HOUSE_BALANCE')) db.push(`${member.id}`, "<:Balance:875309573760770059>");
        if (flags.toArray().includes('BUGHUNTER_LEVEL_2')) db.push(`${member.id}`, "<:BugHunter:875309572154339378>");
        if (flags.toArray().includes('BUGHUNTER_LEVEL_1')) db.push(`${member.id}`, "<:BugHunter:875309572154339378>");
        if (flags.toArray().includes('EARLY_SUPPORTER')) db.push(`${member.id}`, "<:EarlySupporter:875309572263395338>");
        if (flags.toArray().includes('VERIFIED_DEVELOPER')) db.push(`${member.id}`, "<:Developer:875309572498276364>");
        if (flags.toArray().includes('EARLY_VERIFIED_DEVELOPER')) db.push(`${member.id}`, "<:Developer:875309572498276364>");
        if (flags.toArray().includes('DISCORD_STAFF')) db.push(`${member.id}`, "<:Staff:875309572083056661>");
        let djs = member.avatarURL({ dynamic: true });
        if (djs.includes('gif')) db.push(`${member.id}`, "<:Nitro:875311334542180392>");
        var emojis = db.get(`${member.id}`);
        const embed = new Discord.MessageEmbed()
            .setColor('#41749C')
            .setAuthor(member.tag, member.avatarURL({ dynamic: true }))
            .setDescription(`**${emojis}**`)
            .setTimestamp()
        djs.channel.send(embed);
    }
})

/*---------------
> Bot Information
-----------------*/

const os = require('os');
var lol = ['779034600415428608']
client.on('message', djs => {
const { version } = require('./package.json');
if(djs.content.startsWith(prefix + "bot")){
  const core = os.cpus()[0];
    var embed = new Discord.MessageEmbed()
.addField("**Name**", `${client.user.username}`, true)
.addField("**ID**", `${client.user.id}`, true)
.addField("**Bot Servers**",`${client.guilds.cache.size}`, true)
.addField("**Bot Users**",`${client.users.cache.size}`, true)
.addField("**Channels**", `${client.channels.cache.size}`, true) 
.addField("**Bot Developers**",`${lol}`, true)
.addField("**Node.js**", `${process.version}`, true)
.addField("**Verison**", `v${version}`, true)
.addField("**Uptime**", `${pretty(client.uptime)}`, true)
.addField("**Platform**", `${process.platform}`, true)
.addField("**CPU**", `${os.cpus().length}`, true)
.addField("**CPU Model**", `${core.model}`, true)
.addField("**CPU Speed**", `${core.speed}MHz`, true)
   djs.channel.send(embed)
    }
})

/*--------
> AntiFake
----------*/

client.on('message', message => {
    if(message.content.startsWith(prefix + "antifake on")) {
        if(!message.channel.guild) return message.reply('**This Command Only For Servers**');
        if(!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send('**Sorry But You Dont Have Permission** `MANAGE_GUILD`' );
antijoin[message.guild.id] = {
onoff: 'On',
}
message.channel.send(`**✅ The AntiJoin Is __𝐎𝐍__ !**`)
          fs.writeFile("./antijoin.json", JSON.stringify(antijoin), (err) => {
            if (err) return console.error(err)
            .catch(err => {
              console.error(err);
          });
            });
          }
 
        })
 
 
 
client.on('message', message => {
    if(message.content.startsWith(prefix + "antifake off")) {
        if(!message.channel.guild) return message.reply('**This Command Only For Servers**');
        if(!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send('**Sorry But You Dont Have Permission** `MANAGE_GUILD`' );
antijoin[message.guild.id] = {
onoff: 'Off',
}
message.channel.send(`**⛔ The AntiJoin Is __𝐎𝐅𝐅__ !**`)
          fs.writeFile("./antijoin.json", JSON.stringify(antijoin), (err) => {
            if (err) return console.error(err)
            .catch(err => {
              console.error(err);
          });
            });
          }
 
        })
         client.on('message', message => {
          if (!message.channel.guild) return;
   if(message.content.startsWith(prefix + "setfake")) {
          let time = message.content.split(" ").slice(1).join(" ");
       if(!message.channel.guild) return message.reply('**This Command Only For Servers**');
       if(!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send('**Sorry But You Dont Have Permission** `MANAGE_GUILD`' );
if (!time) return message.channel.send('Please Type The Account Created Time [Days]');
let embed = new Discord.RichEmbed()
.setTitle('**Done The AntiJoin Code Has Been Setup**')
.addField('Account Create Time:', `${time}.`)
.addField('Requested By:', `${message.author}`)
.setThumbnail(message.author.avatarURL)
.setFooter(`${client.user.username}`)
message.channel.sendEmbed(embed)
antijoin[message.guild.id] = {
created: time,
onoff: 'On',
}
fs.writeFile("./antijoin.json", JSON.stringify(antijoin), (err) => {
if (err) console.error(err)
})
   }})
 
client.on("guildMemberAdd", async member => {
  if(!antijoin[member.guild.id]) antijoin[member.guild.id] = {
    onoff: 'Off'
  }
  if(antijoin[member.guild.id].onoff === 'Off') return;
  if(!member.user.bot) return;
    let accounttime = `${antijoin[member.guild.id].created}`
    let moment2 = require('moment-duration-format'),
        moment = require("moment"),
        date = moment.duration(new Date() - member.user.createdAt).format("d");
 
    if(date < accounttime) {
      member.ban(`Member account age is lower than ${antijoin[member.guild.id].created} days.`)
    }
});

client.on('message', async message => {
    if (message.content.startsWith(prefix + 'anti-pic')) {
        if (!message.member.hasPermission("MANAGE_CHANNELS")) return message.channel.send(`** ليس لديك صلاحية لإستعمال الأمر ! 🙄 **`);
        let channel = message.mentions.channels.first();
        let channel_find = message.guild.channels.cache.find(ch => ch.id == channel);
        if (!channel) channel_find = message.channel
        if (!channel_find) return;
        channel_find.updateOverwrite(message.guild.id, {
            ATTACH_FILES: false
        });
        message.channel.send(`\n🌌 | تم منع الصور بـ <#${channel_find.id}>\n`);
      
    }
});
client.on('message', async message => {
    if (message.content.startsWith(prefix + 'allow-pic')) {
        if (!message.member.hasPermission("MANAGE_CHANNELS")) return message.channel.send(`** ليس لديك صلاحية لإستعمال الأمر ! 🙄 **`);
        let channel = message.mentions.channels.first();
        let channel_find = message.guild.channels.cache.find(ch => ch.id == channel);
        if (!channel) channel_find = message.channel;
        if (!channel_find) return;
        channel_find.updateOverwrite(message.guild.id, {
            ATTACH_FILES: true
        });
        message.channel.send(`\n🌌 | تم سماح الصور بـ <#${channel_find.id}>\n`);
    }
});

/*-------------
> Auto Nickname
---------------*/

client.on('guildMemberAdd', message => {
if (message.guild.id === ("SERVER ID"))
{
 let user = message.author;
message.setNickname(`AS | ${message.user.username} `);
}
});

/*---------
> Help Menu
-----------*/


client.on('message', message => {
  if(message.content == prefix + 'help' || message.content == 'help') {
    const embed = new Discord.MessageEmbed()
      .setDescription(`
      👑 **Owner**
         \`clear\`,\`ban\`,\`unban\`,\`setnick\`,\`lock\`,\`unlock\`,\`mute\`,\`unmute\`,\`set-order\`,\`role-all\`,\`addemoji\`,\`active-allroles\`,\`temproom\`,\`setup colors\`
      
      🥊 **Security**
          \`antifake on/off\`,\`setfake\`,\`anti-pic\`,\`allow-pic\`,\`antibots on/off\`,\`antilinks on/off\`

      📺 **Discord Together**
           \`youtube-start\`,\`poker-start\`,\`chess-start\`,\`fishing-start\`,\`betrayal-start\`

      🌏 **General**
           \`user\`,\`badges\`,\`invites\`,\`report\`,\`find\`,\`credits\`,\`daily\`,\`tax\`,\`trans\`,\`random\`,\`avatar\`,\`roles\`,\`profile\`,\`iq\`,\`youtube-search\`,\`short\`,\`template\`,\`move\`
         `)
        message.channel.send(embed)
    }
})

/*-----------
> Clear Code
-------------*/

client.on('message', tarik => {
 if(tarik.content.startsWith(prefix + `clear`)) {
  const messageArray = tarik.content.split(' ');
    const args = messageArray.slice(1);
   if(!tarik.channel.guild) return;

    if (!tarik.member.permissions.has("MANAGE_MESSAGES")) return tarik.channel.send('You dont have permissions!');
    
    let deleteAmount; //

    if (isNaN(args[0]) || parseInt(args[0]) <= 0) { return tarik.reply('Please put a number only!') }

    if (parseInt(args[0]) > 100) {
        return tarik.reply('You can only delete 100 messages at a time!')
    } else {
        deleteAmount = parseInt(args[0]);
    } // clear v12  by tarik

    tarik.channel.bulkDelete(deleteAmount + 1, true);
    tarik.reply(`**DONE** Deleted ***${deleteAmount}*** Messages.`)

  }
  });

/*-----------
> Banned
-------------*/

client.on('message', async normal => {
  if (normal.content.startsWith(prefix + "ban")){
        if(!normal.member.hasPermission('BAN_MEMBERS')) return normal.channel.send("You don't have permissions")
           if(!normal.guild.me.hasPermission('BAN_MEMBERS')) return normal.channel.send("I don't have permissions")
         const args = normal.content.slice(prefix.length).trim().split(/ +/g);
        var member = normal.mentions.members.first()||normal.guild.members.cache.get(args[1])||normal.guild.members.cache.find(m => m.user.username === args.slice(1).join(' '));
                if(!member) return normal.channel.send(`**Please Mention user or Type the user ID/Username ${args.slice(1).join(' ')} **`)
                if (member.id === normal.author.id)return normal.reply(`**You can't ban yourself**`)
      if (member.id === normal.guild.me.id)return normal.reply(`**You can't ban me dumbass**`)
                     if(!member.bannable) return normal.channel.send(`**The member role is higher than me**`);

         await member.ban({reason:`He/She just got bannned`})
        normal.channel.send(`**${member.user.username} Has been BANNNED ✈**`)
    } 
})

client.on('message', async message => {

if(message.content.startsWith(prefix + 'unban')) {
    
if(!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send("You dont have the currect permission !")

let userID = message.content.split(' ').slice(1).join(' ')

if(!userID || isNaN(userID)) {
  return message.channel.send('Please enter the user id !') 
} else {

let member;

try {
    member = await client.users.fetch(userID)
} catch (e) {
    return message.channel.send('Not a valid user!').then(m => m.delete({ timeout: 5000 }));
}

message.guild.fetchBans().then( bans => {

const user = bans.find(ban => ban.user.id === member.id );

if (user) {

let embed = new Discord.MessageEmbed()
  .setColor('#00ff00')
  .setTitle('Unban member')
  .addField('Moderator', `${message.author} (\`${message.author.username}\`)`, true)
  .addField('User', `${user.user} (\`${user.user.username}\`)`, true)
message.guild.members.unban(user.user.id).then(() => message.channel.send(embed))

} else {
message.channel.send(`User ${member.tag} isn't banned!`)
}

}).catch(e => {
  console.log(e)
  message.channel.send('An error has occurred!')
});
  }
  }
})

  client.on("message", message => {
        switch(message.content.toLowerCase()) {
            case (prefix + "unbanall"):
                if (message.member.hasPermission("ADMINISTRATOR")) {
                    message.guild.fetchBans().then(bans => {
                        if (bans.size == 0) {message.reply("There are no banned users."); throw "No members to unban."};
                        bans.forEach(ban => {
                            message.guild.members.unban(ban.user.id);
                        });
                    }).then(() => message.reply("Unbanned all users.")).catch(e => console.log(e))
                } else {message.reply("You do not have enough permissions for this command.")}
            break;
        }
      });

/*-----------
> Set Nickname
-------------*/

client.on("message",message=>{
    if(message.content.startsWith(prefix+"setnick")){
      if(!message.member.hasPermission("CHANGE_NICKNAME")) return message.reply("You Dont Have Permission")
      const args = message.content.slice(prefix.length).trim().split(/ +/g);
      let member = message.mentions.users.first() || message.guild.members.cache.get(args[1])||message.guild.members.cache.find(r => r.user.username === args[1])
      if(!member) return message.reply("Type User Example:[prefix]setnick @idk hhhhh")
      let nick = message.content.split(" ").slice(2).join(" ")
      let g = message.guild.members.cache.get(member.id)
      if(!nick){
g.setNickname(member.username)
      }
g.setNickname(nick)
const l = g.nickname|| member.username
let embed = new Discord.MessageEmbed()
.setAuthor(message.member.user.username,message.member.user.avatarURL({dynamic:true}))
.setThumbnail(message.member.user.avatarURL({dynamic:true}))
.setTitle("New NickName:")
.addField(`User Nick Change`,`${member}`,true)
.addField(`Befor:`,`**${l}**`,true)
.addField(`After:`,`**${nick}**`,true)
.setFooter(message.member.user.username,message.member.user.avatarURL({dynamic:true}))
.setTimestamp()
message.channel.send(embed)
    }
  })

/*-----------
> User Info
-------------*/

client.on("message", message=>{
    if(message.content.startsWith(prefix+"user")){
    var userr = message.mentions.users.first() || message.author;
    var memberr = message.mentions.members.first() || message.member;
    let userinfo = userr.displayAvatarURL({ size: 2048 , dynamic: true });
    let embed = new Discord.MessageEmbed()
    . setColor("BLUE")
    .setAuthor(userr.username,userr.avatarURL({dynamic:true}))
    .setThumbnail(userinfo)
    .addField(`Joind Discord :`,`\`${moment(userr.createdAt).format('YYYY/M/D')} ${moment(userr.createdAt).format('LTS')}\`\n**${moment(userr.createdAt, "YYYYMMDD").fromNow()}**`,true)
    .addField(`Joined Server :`,`\`${moment(memberr.joinedAt).format('YYYY/M/D')} ${moment(memberr.joinedAt).format('LTS')}\`\n**${moment(memberr.joinedAt, "YYYYMMDD").fromNow()}**`,true)
  .setFooter(userr.tag,userr.avatarURL({dynamic:true}))
    message.channel.send(embed)
    }
  })


/*
--> Channel Info
*/
client.on('message', badboy => {
  if(badboy.content.startsWith(prefix + "channelinfo")){
var channel = badboy.mentions.channels.first();
if(!channel) return badboy.channel.send("منشن الروم")
var embed = new Discord.MessageEmbed()
.addField("channel id", `${channel.id}`)
.addField("channel name", `${channel.name}`)
.addField("createdAt", `${channel.createdAt}`)
.setColor("BLUE")
badboy.channel.send(embed)
  }
})

/*
--> IQ Command
*/

client.on('message', badboy => {
  if(badboy.content.startsWith(prefix + "iq")){
    const iq = [
'5',
'6',
'10',
'17',
'20',
'15',
'24',
'30',
'35',
'40',
'43',
'45',
'50',
'55',
'60',
'75',
'85',
'90',
'99',
'100',
    ];
                let an = iq[Math.floor(Math.random() * iq.length)];
                var embed = new Discord.MessageEmbed()
.setDescription(`${badboy.author.username} your iq has ${an}`)
.setColor("BLUE")
.setFooter(`Requsted By ${badboy.author.tag}`, badboy.author.avatarURL({dynamic : true}))
.setThumbnail(`${badboy.guild.iconURL({dynamic : true})}`)
badboy.channel.send(embed)
  }
})

/*
> Tag
*/
const figlet = require ("figlet");
client.on('message', saif => {
if (saif.content.startsWith(prefix + 'tag')) {
    let args = saif.content.split(" ").slice(1);
if(!args[0]) return saif.reply('i dont see any word !?!');  

    figlet(args.join(" "), (err, shark) => {
              saif.channel.send(`\`\`\`${shark}\`\`\``)
           })
}
});

/*-----------
> Lock & Unlock
-------------*/

client.on('message', message => {
    if (message.content === prefix + "lock") {
      if(!message.channel.guild) return message.reply(' هذا الامر فقط للسيرفرات !!');
 
if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.reply(' ليس لديك صلاحيات');
           message.channel.overwritePermissions(message.guild.id, {
         SEND_MESSAGES: false
 
           }).then(() => {
               message.reply("تم تقفيل الشات ✅ ")
           });
             }
if (message.content === prefix + "unlock") {
    if(!message.channel.guild) return message.reply(' هذا الامر فقط للسيرفرات !!');
 
if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.reply('ليس لديك صلاحيات');
           message.channel.overwritePermissions(message.guild.id, {
         SEND_MESSAGES: true
 
           }).then(() => {
               message.reply("تم فتح الشات✅")
           });
             }
});

/*-----------
> Owner Info
-------------*/

client.on("message", message=>{
    if(message.content.startsWith(prefix+"owner")){
      var embed = new Discord.MessageEmbed()
      .setAuthor(message.guild.owner.user.username, message.guild.owner.user.avatarURL({dynamic:true}))
      .setThumbnail(message.guild.owner.user.avatarURL({dynamic:true}))
      .setTitle("📃INFO OWNER:")
  .addField("✏️ UserName:",message.guild.owner.user.tag,)
  .addField("#️⃣ Tag:",`#${message.guild.owner.user.discriminator}`,)
  .addField("🆔 Id:",message.guild.owner.user.id,)
  .addField("🟢 Status:",message.guild.owner.user.presence.status,)
  .addField("🕐 Creadt At:",`${moment(message.guild.owner.user.createdAt).format('YYYY/M/D')}\n\`${moment(message.guild.owner.user.createdAt, "YYYYMMDD").fromNow()}\``,)
  .setFooter(client.user.username,client.user.avatarURL({dynamic:true}))
  .setTimestamp()
     message.channel.send(embed)
    }
  })

/*-----------
> Mute Code
-------------*/

client.on('message', async normal => {
  if (normal.content.startsWith(prefix + "mute")){
        if(!normal.member.hasPermission('MANAGE_ROLES')) return normal.channel.send("You don't have permissions")
         const args = normal.content.slice(prefix.length).trim().split(/ +/g);
        var member = normal.mentions.members.first()||normal.guild.members.cache.get(args[1])||normal.guild.members.cache.find(m => m.user.username === args.slice(1).join(' '));
                if(!member) return normal.channel.send(`**Please Mention user or Type the user ID/Username ${args.slice(1).join(' ')} **`)
                if (member.id === normal.author.id)return normal.reply(`**You can't mute yourself**`)
      if (member.id === normal.guild.me.id)return normal.reply(`**You can't mute me dumbass**`)
        let mutedrole = normal.guild.roles.cache.find(ro => ro.name === 'Muted')
        if(!mutedrole) {
        try {
        var createdrole = await normal.guild.roles.create({
                      data : {
                        name : 'muted',
                        permissions: [],
                    }});
                        normal.guild.channels.cache.forEach(async (channel, id) => {
                            await channel.createOverwrite(createdrole, {
                                SEND_MESSAGES: false,
                                ADD_REACTIONS : false
                            })
                        })
                } catch (err) {
                console.log(err)
            }};
   let muterole = normal.guild.roles.cache.find(r => r.name === 'Muted')
         member.roles.add(muterole)
        normal.channel.send(`**${member.user.username} Has been muted**`)
    } 
})



/*-----------
> Order Code
-------------*/

client.on('message', message => {
    if(message.content.startsWith(prefix + 'set-order')) {
        if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(`**حرك**`)
      var chnl = message.mentions.channels.first()
    if (!chnl) return message.channel.send(`**Mention A Room**`)
    db.set(`chnl_${message.guild.id}` , chnl.id)
    message.channel.send(`**Done ${chnl} Is The Order Channel**`)
    
    
    
    }
    });
client.on('message' , message => {
if(message.content.startsWith(prefix + 'order')){
var chnnel = db.fetch(`chnl_${message.guild.id}`)

var args = message.content.split(" ").slice(1).join(" ")
if(!args) return message.channel.send(`**Type Your Order**`)

var embed = new Discord.MessageEmbed()

.setTitle(`**New Order**`) 


.setDescription(`**
\`${args}\`
**`)

.setFooter(`By ${message.author.username}`)


client.channels.cache.get(chnnel).send(embed)

message.channel.send(`**Your Order Has Send**`)
 

 }
 });

/*-----------
> RoleAll Code
-------------*/

client.on('message', async normal => {
          if(normal.content.startsWith(prefix + 'role-all')) {
          if(!normal.member.hasPermission("MANAGE_ROLES")) return normal.channel.send(`You Don't have the permission : *MANAGE_ROLES**`);
     var rrole = normal.content.split(" ").slice(1).join(" ");
          var role = normal.mentions.roles.first() || normal.guild.roles.cache.find(r => r.name === rrole)||normal.guild.roles.cache.find(r => r.id === rrole);
          if(!role) return normal.channel.send(`**I can't find this role ${rrole}!?**`);
            normal.guild.members.cache.forEach(async m => { 
             await
              m.roles.add(role)
             })
       normal.channel.send(`**${role.name} has been added to all the members in this server**`)
   }
 })

/*------------------------
> AutoRole & Auto Reaction
--------------------------*/

let role = (""); // ROLE ID
client.on("guildMemberAdd" , (member) => {
member.roles.add(role)
})

client.on("guildMemberAdd", member =>{
let role = member.guild.roles.cache.find(role => role.name == (""))
if (!role) return;
  member.roles.add(role);
});

client.on("message", async message => {
  if (message.guild.id != ("SERVER ID")) return;
   if (message.channel.id != ("CHANNEL ID")) return;
    if(message.author.id === client.user.id) return;
       message.react("ADD REACTION")
  }
)

/*
--> Joined and Left DM
*/
client.on("guildMemberAdd", member => {
  member.createDM().then(function (channel) {
  return channel.send(`**نورتنا نقدم لك افضل بوت لتقديم الاكواد ورفع الخوادم 
  
  امر تشغيل البوت: ${prefix}**`)//الرساله
}).catch(console.error)
})


client.on("guildMemberRemove", member => {
  member.createDM().then(function (channel) {
  return channel.send(`تنورنا من جديد اذا احببت`)
}).catch(console.error)
})

/*-----------
> Add Emoji CODE
-------------*/

client.on("message",message => {
    var args = message.content.split(" ");
    var command = args[0];
    var emojisname = args[1];
    var emojislink = args[2];
    if (command === prefix + "addemoji"){
        if (!message.guild){
            return message.channel.send("you can use it in your server only");
        }
        if (!message.guild.member(client.user).hasPermission("MANAGE_EMOJIS")){
            return message.channel.send("i don't have any premissions  `MANAGE_EMOJIS`");
        }
        if(!message.guild.member(message.author).hasPermission("MANAGE_EMOJIS")) {
            return message.channel.send("you don't hane any premissions `MANAGE_EMOJIS`");
        }
        if(!emojisname){
            return message.channel.send("Type emoji's name");
        }
        if (!emojislink){
            return message.channel.send("Type emoji's url");
        }
        message.guild.emojis.create(emojislink, emojisname).then(emoji =>{
            message.channel.send("Emoji Created . <:"+emoji.name+":"+emoji.id+">")
        }).catch(err => message.channel.send("Emoji must be under 256kb in size"));
    }
});

/*-----------
> Auto Reply
-------------*/

client.on("message", message => {
  if (message.content == ("Hello")) {
    message.lineReply("Hello How are You")
  }
})

client.on("message", message => {
  if (message.content == ("الكلام")) {
    message.lineReply("الرد")
  }
})

client.on("message", message => {
  if (message.content == ("الكلام")) {
    message.lineReply("الرد")
  }
})

client.on("message", message => {
  if (message.content == ("الكلام")) {
    message.lineReply("الرد")
  }
})

client.on("message", message => {
  if (message.content == ("الكلام")) {
    message.lineReply("الرد")
  }
})

/*------------
--> Send DM to Bot 
--------------*/

client.on("message", (message) => {
    if (message.channel.type === "dm") {
        var channel = client.channels.cache.find(c => c.id === "") // اي دي الشنل
        if (message.author.id === client.user.id) return;
        let ncr_codes = new Discord.MessageEmbed()
            .setTimestamp()
            .setTitle("رسالة الى البوت")
            .addField(`أرسلت بواسطة:`, `<@${message.author.id}>`)
            .setColor("RANDOM")
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
            .addField(`رسالة: `, `\n\n\`\`\`${message.content}\`\`\``)
            .setFooter(`Naar Codes`)
        channel.send(ncr_codes)
    }
});

/*
> Report
*/
const error = "❎"
const done = "✅"
client.on('message', msg => {
    if(msg.content.startsWith(prefix + "report")){
    const reason = msg.content.split(" ").slice(2).join(" ");
 let reportschannel = msg.guild.channels.cache.find(channel => channel.name === "report");
    const user = msg.mentions.users.first();user
 if(!user) return msg.lineReply(` يرجئ ان تمنشن العضو ${error}`)
  if(!reason) return msg.lineReply(` اكتب القصة ${error}`)
             if(user.bot) return msg.lineReply(`لا يمكنك${error} الابلاغ عن بوت`)
               if (user.id == msg.author.id)
return msg.lineReply(`لا يمكنك الابلاغ على نفسك ${error}`)
    const embed = new Discord.MessageEmbed()
    .setColor('0fb50f')
    .addField(`ابلاغ جديد`,`**-----------------**`)
    .addField(` اسم العضو المبلغ علية`,` ${user.username}`)
    .addField(` ايدي العضو المبلغ علية`,`${user.id}`)
    .addField(`القصه`,`${reason}`)
    .addField(`اسم المبلغ `,`${msg.author.username}`)
    .addField(`ايدي المبلغ`,`${msg.author.id}`)
    .setTimestamp()
    reportschannel.send(embed)
    msg.channel.send(`Done ${done}`) 
   }
});

/*
> Discord Together
*/

const { DiscordTogether } = require('discord-together');

client.discordTogether = new DiscordTogether(client);

client.on('message', async message => {

	if (message.content === prefix + 'youtube-start') {

		if (message.member.voice.channel) {

			client.discordTogether

				.createTogetherCode(message.member.voice.channelID, 'youtube')

				.then(async invite => {

					return message.channel.send(

						new Discord.MessageEmbed()

							.setDescription(`[<:YouTube:876130520633847838> Playing YouTube](${invite.code})`)

							.setColor(`${message.member.displayHexColor}`)

					);

				});

		}

	}

});



client.on('message', async message => {

	if (message.content === prefix + 'poker-start') {

		if (message.member.voice.channel) {

			client.discordTogether

				.createTogetherCode(message.member.voice.channelID, 'poker')

				.then(async invite => {

					return message.channel.send(

						new Discord.MessageEmbed()

							.setDescription(`[<:Poker:876131027737788516> Start Poker](${invite.code})`)

							.setColor(`${message.member.displayHexColor}`)

					);

				});

		}

	}

});



client.on('message', async message => {

	if (message.content === prefix + 'chess-start') {

		if (message.member.voice.channel) {

			client.discordTogether

				.createTogetherCode(message.member.voice.channelID, 'chess')

				.then(async invite => {

					return message.channel.send(

						new Discord.MessageEmbed()

							.setDescription(`[Start Chess](${invite.code})`)

							.setColor(`${message.member.displayHexColor}`)

					);

				});

		}

	}

});



client.on('message', async message => {

	if (message.content === prefix + 'fishing-start') {

		if (message.member.voice.channel) {

			client.discordTogether

				.createTogetherCode(message.member.voice.channelID, 'fishing')

				.then(async invite => {

					return message.channel.send(

						new Discord.MessageEmbed()

							.setDescription(`[Start Fishing](${invite.code})`)

							.setColor(`${message.member.displayHexColor}`)

					);

				});

		}

	}

});



client.on('message', async message => {

	if (message.content === prefix + 'betrayal-start') {

		if (message.member.voice.channel) {

			client.discordTogether

				.createTogetherCode(message.member.voice.channelID, 'betrayal')

				.then(async invite => {

					return message.channel.send(

						new Discord.MessageEmbed()

							.setDescription(`[Start Betrayal](${invite.code})`)

							.setColor(`${message.member.displayHexColor}`)

					);

				});

		}

	}

});

/*------------
--> Show Invites
--------------*/

client.on('message', msg => {
  if (msg.content.split(' ')[0].toLowerCase() == prefix + 'invites') {
    let guild = msg.guild
    var codes = [""]
    var nul = 0

    guild.fetchInvites()
      .then(invites => {
        invites.forEach(invite => {
          if (invite.inviter === msg.author) {
            nul += invite.uses
            codes.push(`discord.gg/${invite.code}`)
          }

        })
        if (nul > 0) {
          const e = new Discord.MessageEmbed()
            .addField(`${msg.author.username}`, `لقد قمت بدعوة **${nul}** شخص`)
            .setColor('#36393e')
          msg.channel.send(e)
        } else {
          var embed = new Discord.MessageEmbed()
            .setColor("#000000")
            .addField(`${msg.author.username}`, `لم تقم بدعوة أي شخص لهذة السيرفر`)

          msg.channel.send({ embed: embed });
          return;
        }
      })
  }
})


/*
> ServerStats
*/

client.on("ready",() =>{
let guild = client.guilds.cache.get('') // ايدي السيرفر
if(!guild) return console.log('I can\'t find the server')
let channel = guild.channels.cache.get('')//ايدي الروم
if(!channel) return console.log('I can\'t the channel') // عشان يتاكد ان الروم موجود
if(channel){
  setInterval(() => {
    channel.setName('Members :' + guild.memberCount)
  }, ms("1m"));
}
})

client.on('message', m =>{
  if (m.content === 'prefix') {
    m.reply("Prefix of Bot : \`kk-\`");
  }
});

/*
--> Muted beacuse send link
*/
client.on('message', badboy => {
  if(badboy.content.startsWith("https://")){

    if(badboy.author.bot || !badboy.guild) return

    const muterole = badboy.guild.roles.cache.find(r => r.name === "Muted");
  
   badboy.member.roles.add(muterole)
  var mutelog = badboy.guild.channels.cache.find(r=> r.name ==='log');
mutelog.send(`Muted ${badboy.author.username} `)
    badboy.delete()
  }
  })

client.on("message", message =>{
  if(message.content.startsWith(prefix + "credits")){
 let user = message.mentions.users.first() || message.author;
    let bal = db.fetch(`money_${user.id}`)
    if (bal === null) bal = 0;
      return message.channel.send(`:bank: | **${user.username} , your account balance is** \`\`$${bal}\`\`.`)
}});

client.on("message", async message => {
if(message.content.startsWith(prefix + "daily")){
    let timeout = 86400000/2 // 12 hours in milliseconds, change if you'd like.
  let amount = Math.floor(Math.random() * 20000) + 1;
    let daily = await db.fetch(`daily_${message.author.id}`);
    if (daily !== null && timeout - (Date.now() - daily) > 0) {
        let time = ms(timeout - (Date.now() - daily));
        message.channel.send(`:rolling_eyes: **| ${message.author.username}, your daily credits refreshes in ${time.hours}h ${time.minutes}m ${time.seconds}s .** `)
    } else {
    message.channel.send(`:moneybag: **${message.author.username}, you got :dollar: ${amount} daily credits!**`)
    db.add(`money_${message.author.id}`, amount)
    db.set(`daily_${message.author.id}`, Date.now())
    }}});
client.on("message", async message =>{
  if(message.content.startsWith(prefix + "trans")){
    let args = message.content.split(" ").slice(2); 
    let user = message.mentions.members.first()
    let member = db.fetch(`money_${message.author.id}`)
    if (!user) {
        return message.channel.send(`:rolling_eyes: | ** ${message.author.username}, I Cant Find a User**`)
    }
    if (!args) {
        return message.channel.send(`:rolling_eyes: | **${message.author.username}, type the credit you need to transfer!**`)
    }
    if (message.content.includes('-')) {
      return message.channel.send(`:rolling_eyes: | **${message.author.username}, Type a Amount \`Not Negative\`**`)
    }
    if (member < args) {
        return message.channel.send(`:thinking: ** | ${message.author.username}, Your balance is not enough for that!**`)
    }
    if(isNaN(args)) 
return message.channel.send(`:rolling_eyes: Numbers Only`)
    message.channel.send(`:moneybag: **| ${message.author.username}, has transferred \`$${args}\` to ${user}**`)
    user.send(`:atm:  |  Transfer Receipt \n\`\`\`You have received $${args} from user ${message.author.username} (ID: ${user.id})\`\`\``)
    db.add(`money_${user.id}`, args)
    db.subtract(`money_${message.author.id}`, args)
}});

/*------------
--> ProBot Tax 
--------------*/

const probot = require("probot-tax");
client.on("message", message => {
    if (message.content.startsWith(prefix + 'tax')) {
        let args = message.content.split(" ").slice(1).join(" ");
        if (!args) return message.reply('حط المبلغ')
        let embed = new Discord.MessageEmbed()
            .setColor('RED')
            .addFields({
                name: "`المبلغ:`",
                value: `**${args}**`

            }, {
                name: "`الضريبه:`",
                value: `**${Number(probot.taxs(args)) - args}**`
            }, {
                name: "`المبلغ مع الضريبه:`",
                value: `**${Number(probot.taxs(args))}**`
            }, )
            .setFooter(`By  : ${message.author.username}`, `${message.author.displayAvatarURL()}`)
            .setThumbnail(message.author.displayAvatarURL())
            .setTimestamp()

        message.channel.send(embed)
    }
})

/*--------------
--> Random Email 
----------------*/

var randomEmail = require('random-email');
var randomPassword = require('random-password');
client.on("message", async message => {
  if(message.content.toLowerCase() ===prefix + "random") {
      if(message.author.id == "767484873908682810") return;
    let data = await randomEmail({ domain: 'gmail.com' })
    let data1 = await randomPassword(NaN);
    message.channel.send(new Discord.MessageEmbed()
    .addField(`✉️ - Email :`,data)
    .addField(`⛓ - Pass : `,data1))
  }
})

/*---------------
--> Active 3Role 
-----------------*/

client.on("message", message => {
if (message.content.startsWith("active-allroles")){
if(!message.member.roles.cache.has('ايدي الرتبه الي تستعمل الامر'))
return message.channel.send(`ليس لديك صلاحية لأستعمال هذا الأمر`)
const member = message.mentions.members.first()
if (!member) return;

let role = message.guild.roles.cache.find(role => role.name === 'اسم الرتبه');
let role2 = message.guild.roles.cache.find(role => role.name === 'اسم الرتبه');
let role3 = message.guild.roles.cache.find(role => role.name === 'اسم الرتبه');
member.roles.add(role)
member.roles.add(role2)
member.roles.add(role3)
message.channel.send(`Done ,تم تسليم الرتب ✅`)
}
})

/*--------------
> YouTube Search
----------------*/

client.on("message", message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).trim().split(' ');
  const command = args.shift().toLowerCase();
if(command === "youtube-search"){
    message.channel.send(
      new Discord.MessageEmbed()
      .setThumbnail(client.user.avatarURL())
.setColor("RED")
      .setTitle('تم ايجاد بحث في اليوتيوب اضغط هنا')
      .setURL(`https://www.youtube.com/results?search_query=${args}`)
    );
  }
});

/*---------
> Temp Role
-----------*/

client.on('message', async(msg) => {
    if (msg.content.startsWith(prefix + "temp-role")) {
        var args = msg.content.split(" ");
        var time = args[3];
        var user = msg.mentions.members.first() || client.users.cache.get(args[1]);
        var member = msg.guild.member(user);
        var role = msg.guild.roles.cache.find(r => r.name === args[2]) || msg.mentions.roles.first() || msg.guild.roles.cache.find(r => r.id === args[2])
        if (!msg.member.hasPermission("MANAGE_CHANNELS")) return msg.channel.send(
            new Discord.MessageEmbed()
            .setAuthor('❌ | خطأ', msg.author.avatarURL())
            .setColor("RED")
            .setDescription(`**❌ | ليس لديك صلاحيات**`)
            .setThumbnail(msg.author.avatarURL())
            .setTimestamp()
            .setFooter("Requested By: " + msg.author.tag, msg.author.avatarURL())
        );
        if (!user) return msg.channel.send(
            new Discord.MessageEmbed()
            .setAuthor('❌ | خطأ', msg.author.avatarURL())
            .setColor("RED")
            .setDescription(`**❌ | من فظلك قم بمنشن للشخص او قم بكتابة الايدي**`)
            .setThumbnail(msg.author.avatarURL())
            .setTimestamp()
            .setFooter("Requested By: " + msg.author.tag, msg.author.avatarURL())
        );
        if (!role) return msg.channel.send(
            new Discord.MessageEmbed()
            .setAuthor('❌ | Error', msg.author.avatarURL())
            .setColor("RED")
            .setDescription(`**❌ | من فضلك قم بكتابة اسم او اي دي الرتبة**`)
            .setThumbnail(msg.author.avatarURL())
            .setTimestamp()
            .setFooter("Requested By: " + msg.author.tag, msg.author.avatarURL())
        );
        if (!time) time = "24h"//اكتب المدة الي تريدها للرتبة
        if (user.id === msg.author.id) return msg.channel.send(
            new Discord.MessageEmbed()
            .setAuthor('❌ | خطأ', msg.author.avatarURL())
            .setColor("RED")
            .setDescription(`**❌ | لاتستطيع اعطاء رتبة لنفسك**`)
            .setThumbnail(msg.author.avatarURL())
            .setTimestamp()
            .setFooter("Requested By: " + msg.author.tag, msg.author.avatarURL())
        );
        if (user.id === client.user.id) return msg.channel.send(
            new Discord.MessageEmbed()
            .setAuthor('❌ | خطأ', msg.author.avatarURL())
            .setColor("RED")
            .setDescription(`**❌ | لاتستطيع اعطاء البوت رتبة**`)
            .setThumbnail(msg.author.avatarURL())
            .setTimestamp()
            .setFooter("Requested By: " + msg.author.tag, msg.author.avatarURL())
        );
        member.roles.add(role);
        msg.channel.send(
            new Discord.MessageEmbed()
            .setAuthor('✅ | تم', msg.author.avatarURL())
            .setColor("GREEN")
            .setDescription(`**✅ | <@!${user.id}> تم اعطء الرتبة <@!${role.id}> لـ ${ms(ms(time))}.**`)
            .setThumbnail(msg.author.avatarURL())
            .setTimestamp()
            .setFooter("Requested By: " + msg.author.tag, msg.author.avatarURL())
        );
        setTimeout(() => {
            member.roles.remove(role)
        }, ms(time))
    }
});

/*------------
--> Find Users
--------------*/

client.on('message', async message => {
  if(message.content.toLowerCase().startsWith(prefix + 'find')) {
    let args = message.content.split(' ').slice(1).join(' ');
    if(!args) return message.channel.send(`:x: ${prefix}find <some includes>`)
    let users = [];

    await message.guild.members.cache.forEach(user => {
      let nick = message.guild.member(user).nickname
      if(nick == null) return;
      if(nick.toLowerCase().includes(args.toLowerCase())) users.push(user.user)
    })

    await message.channel.send(
      new Discord.MessageEmbed()
      .setTitle(`All nick names include ${args}`)
      .setDescription(users.join('\n') || 'None')
    )
  }
})

/*------------
--> Voice Kick 
--------------*/

client.on('message', async badboy => {
  if(badboy.content.startsWith(prefix + "vkick")){
    if(!badboy.member.hasPermission("MOVE_MEMBERS")) return 
              if (!badboy.channel.guild) return badboy.channel.send('This is for servers only');

 let user = badboy.guild.member(
        badboy.mentions.users.first())

        if(!user) return badboy.channel.send("Mention Some One")
         if (!badboy.guild.member(user).voice.channel) return badboy.channel.send("هاذا الشخص ليس بروم صوتي")
    await user.voice.kick()
badboy.channel.send(`تم طرد هاذا الشخص من الروم الصوتي ${user}`)
  }
})

client.on('message', message => { 

//OT bad boy 

if(message.content.startsWith(prefix + "serverinformaion")){ 

    if (message.author.bot || !message.guild) return message.reply("this command for server only") 

 

//OT bad boy 

var EMBED = new Discord.MessageEmbed() 

.setTitle("server info") 

.addField("server name", `${message.guild.name}`) 

.addField("server id", `${message.guild.id}`) 

.addField("server owner", `${message.guild.owner}`) 

.addField("members", `${message.guild.memberCount}`) 

.addField("Server roles", `${message.guild.roles.cache.size}`) 
 .addField("channel", `${message.guild.channels.cache.filter(r => r.type === "text").size} Text
      ${message.guild.channels.cache.filter(r => r.type === "voice").size} Voice`)

.addField("server region", `${message.guild.region}`) 

.addField("Verification Level", `${message.guild.verificationLevel}`) 

.addField("created in", `${message.guild.createdAt.toLocaleString()}`) 

.addField("Boost", `${message.guild.premiumSubscriptionCount}`) 

 
.setThumbnail(`${message.guild.iconURL({dynamic : true})}`)

.setAuthor(`${message.guild.name}`)
.setFooter(`request by ${message.author.username}`)
.setColor("BLUE") 
message.channel.send(EMBED) 

} 

}) 


///

var badwords = ["الكلمة", "الكلمة"]; // لاضافة كلمات اتبع الخطوات التالية
// 1 - ضيف فوق ,""
// 2 - تكتب الكلمة السيئة بين ال "" وبس
client.on("message", message => {
  if (message.content.includes(badwords)) {
    message.delete();
  }
});


///

client.on('message', async tfcmandmrawan => {
if(tfcmandmrawan.content.startsWith(prefix + "temproom")){
  if (!tfcmandmrawan.member.permissions.has("MANAGE_CHANNELS")) return tfcmandmrawan.channel.send('You dont have permissions!');
  tfcmandmrawan.delete();
  let namechannel = tfcmandmrawan.content.split(" ")[1];
  if (!namechannel) return tfcmandmrawan.channel.send(`Please Type The Room Name Like This ${prefix}temproom name `)
  const time = tfcmandmrawan.content.split(" ")[2];
  if (!time) return tfcmandmrawan.channel.send("Type The Time Like 10s 10m 10h 10d")
  let ggg = ['d', "m", "h", "s"];
  if (ggg.some(c => time.endsWith(c))) {
  const timee = ms(time);
  console.log(timee);
  if (timee <= 9999) return tfcmandmrawan.channel.send(`**You Can't Make Temproom Time Less Than 10sec**`);
  if (timee > 2592000000) return tfcmandmrawan.channel.send(`**You Can't Make Temproom Time More Than 30Day**`)
  }
  tfcmandmrawan.channel.send(`**Done! I Have Created ${namechannel} As A Temp Channel!**`)
  const mr = await tfcmandmrawan.guild.channels.create(`${namechannel}`, { type: 'text' });
  setTimeout(async function(){
    mr.delete()

  }, ms(time))
  
  
        }
});

client.on('message', message => {
    if (message.content.startsWith(prefix + 'avatar')) {
        const user = message.mentions.users.first() || 
    message.author;
        const avatarEmbed = new Discord.MessageEmbed()
            .setTitle(`${user.username} Avatar`)
            .setColor(0x333333)
            .setImage(user.displayAvatarURL({ dynamic: true }));
        message.channel.send(avatarEmbed);
    }
});

client.on("message", (ncrTeam) => {
    if (ncrTeam.content.startsWith(prefix + "roles")) {
        let Roles = ncrTeam.guild.roles.cache.map(ncr => `"${ncr.name}" - ${ncr.id} - ${ncr.members.array().length}`).sort().join("\n");
        ncrTeam.channel.send(
            new Discord.MessageEmbed()
            .setColor()
            .setTimestamp()
            .setDescription(
                "```\n" + Roles + "\n```", { split: { char: "\n" } }
            )
        );
    }
})

/*
--> AntiBots
*/

let antibots = JSON.parse(fs.readFileSync('./antibots.json', 'utf8'));//require antihack.json file
client.on('message', message => {
  if (message.content.startsWith(prefix + "antibots on")) {
    if (!message.channel.guild) return message.reply('**This Command Only For Servers**');
    if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('**Sorry But You Dont Have Permission** `ADMINISTRATOR`');
    antibots[message.guild.id] = {
      onoff: 'On',
    }
    message.channel.send(`**✅ The AntiBots Is __𝐎𝐍__ !**`)
    fs.writeFile("./antibots.json", JSON.stringify(antibots), (err) => {
      if (err) console.error(err)
        .catch(err => {
          console.error(err);
        });
    });
  }

})



client.on('message', message => {
  if (message.content.startsWith(prefix + "antibots off")) {
    if (!message.channel.guild) return message.reply('**This Command Only For Servers**');
    if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('**Sorry But You Dont Have Permission** `ADMINISTRATOR`');
    antibots[message.guild.id] = {
      onoff: 'Off',
    }
    message.channel.send(`**⛔ The AntiBots Is __𝐎𝐅𝐅__ !**`)
    fs.writeFile("./antibots.json", JSON.stringify(antibots), (err) => {
      if (err) console.error(err)
        .catch(err => {
          console.error(err);
        });
    });
  }

})


client.on("guildMemberAdd", member => {
  if (!antibots[member.guild.id]) antibots[member.guild.id] = {
    onoff: 'Off'
  }
  if (antibots[member.guild.id].onoff === 'Off') return;
  if (member.user.bot) return member.kick()
})

fs.writeFile("./antibots.json", JSON.stringify(antibots), (err) => {
  if (err) console.error(err)
    .catch(err => {
      console.error(err);
    });

});

/*
--> AntiLinks
*/

let spread = JSON.parse(fs.readFileSync('./antilinks.json' , 'utf8'));
 
 
client.on('message', message => {
    if(message.content.startsWith(prefix + "antilinks off")) {
        if(!message.channel.guild) return message.reply('**This Command Only For Servers**');
        if(!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send('**Sorry But You Dont Have Permission** `MANAGE_GUILD`' );
spread[message.guild.id] = {
onoff: 'Off',
}
message.channel.send(`**⛔ The AntiSpread Is __𝐎𝐅𝐅__ !**`)
          fs.writeFile("./spread.json", JSON.stringify(spread), (err) => {
            if (err) console.error(err)
            .catch(err => {
              console.error(err);
          });
            });
          }
 
        })
        client.on('message', message => {
    if(message.content.startsWith(prefix + "antilinks on")) {
        if(!message.channel.guild) return message.reply('**This Command Only For Servers**');
        if(!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send('**Sorry But You Dont Have Permission** `MANAGE_GUILD`' );
spread[message.guild.id] = {
onoff: 'On',
}
message.channel.send(`**✅ The AntiSpread Is __𝐎𝐍__ !**`)
          fs.writeFile("./spread.json", JSON.stringify(spread), (err) => {
            if (err) console.error(err)
            .catch(err => {
              console.error(err);
          });
            });
          }
 
        })
    client.on('message', message => {
    var args = message.content.split(/[ ]+/)
    if(message.content.includes('http://')){
            if(!spread[message.guild.id]) spread[message.guild.id] = {
        onoff: 'Off'
            }
        if(spread[message.guild.id].onoff === 'Off') return;
        message.delete()
    return message.reply(`**⛔ The Antispread ON ! So You Cant spread Here !**`)
    }
});
 
client.on('message', message => {
    var args = message.content.split(/[ ]+/)
    if(message.content.includes('https://www.snapchat.com/')){
            if(!spread[message.guild.id]) spread[message.guild.id] = {
        onoff: 'Off'
 
            }
        if(spread[message.guild.id].onoff === 'Off') return;
        message.delete()
    return message.reply(`**⛔ The Antispread ON ! So You Cant spread Here !**`)
    }
});
 
 
client.on('message', message => {
    var args = message.content.split(/[ ]+/)
    if(message.content.includes('https://www.instagram.com/')){
            if(!spread[message.guild.id]) spread[message.guild.id] = {
        onoff: 'Off'
            }
        if(spread[message.guild.id].onoff === 'Off') return;
        message.delete()
    return message.reply(`**⛔ The Antispread ON ! So You Cant spread Here !**`)
    }
});
 
 
client.on('message', message => {
    var args = message.content.split(/[ ]+/)
    if(message.content.includes('https://www.twitter.com/')){
            if(!spread[message.guild.id]) spread[message.guild.id] = {
        onoff: 'Off'
            }
        if(spread[message.guild.id].onoff === 'Off') return;
        message.delete()
    return message.reply(`**⛔ The Antispread ON ! So You Cant spread Here !**`)
    }
});
 
 
client.on('message', message => {
    var args = message.content.split(/[ ]+/)
    if(message.content.includes('http://www.facebook.com/')){
            if(!spread[message.guild.id]) spread[message.guild.id] = {
        onoff: 'Off'
            }
        if(spread[message.guild.id].onoff === 'Off') return;
        message.delete()
    return message.reply(`**⛔ The Antispread ON ! So You Cant spread Here !**`)
    }
});
 
 
 
client.on('message', message => {
    var args = message.content.split(/[ ]+/)
    if(message.content.includes('https://www.youtube.com/')){
            if(!spread[message.guild.id]) spread[message.guild.id] = {
        onoff: 'Off'
            }
        if(spread[message.guild.id].onoff === 'Off') return;
        message.delete()
    return message.reply(`**⛔ The Antispread ON ! So You Cant spread Here !**`)
    }
 
});
 
client.on('message', message => {
    var args = message.content.split(/[ ]+/)
    if(message.content.includes('https://www.discordapp.com/')){
            if(!spread[message.guild.id]) spread[message.guild.id] = {
        onoff: 'Off'
            }
        if(spread[message.guild.id].onoff === 'Off') return;
        message.delete()
    return message.reply(`**⛔ The Antispread ON ! So You Cant spread Here !**`)
    }
 
});
client.on('message', message => {
    var args = message.content.split(/[ ]+/)
    if(message.content.includes('https://discord.gg/')){
            if(!spread[message.guild.id]) spread[message.guild.id] = {
        onoff: 'Off'
            }
        if(spread[message.guild.id].onoff === 'Off') return;
        message.delete()
    return message.reply(`**⛔ The Antispread ON ! So You Cant spread Here !**`)
    }
 
});

client.on("message", Russi => {
  if (Russi.content.includes("https://") || Russi.content.includes("Https://")) {
      if(Russi.member.hasPermission('ADMINISTRATOR')) return;
    console.log("Share links" + Russi.content + " from " + `${Russi.author.tag}` + "successful deleted")
      Russi.delete();
    Russi.channel.send("**No i delete your message you can not share links here , " + `<@${Russi.author.id}>**`)
  }
  if (Russi.content.includes("http://") || Russi.content.includes("Http://")) {
    if(Russi.member.hasPermission('ADMINISTRATOR')) return;
    console.log("Share links " + Russi.content + " from " + `${Russi.author.tag}` + "successful deleted")
    Russi.delete();
    Russi.channel.send("**No  I delete your message you can not share the links here, " + `<@${Russi.author.id}>**`)
  }
  if (Russi.content.includes("www.") || Russi.content.includes("Www.")) {
if(Russi.member.hasPermission('ADMINISTRATOR')) return;
    console.log("share links" + Russi.content + " from " + `${Russi.author.tag} + "successful deleted"`)
    Russi.delete();
    Russi.channel.send("**No , I delete your message , you can not share links here , " + `<@${Russi.author.id}>**`)
 }
});

//

client.on('message', message => {
  if (message.content === prefix + 'test') {
    message.lineReply("Online ThankYou")
    message.react("🟢")
  }
})

/*
*/

client.on('message', ninja => {
if(!ninja.channel.guild) return;
if(ninja.content.startsWith(prefix + 'move')) {
  if (!ninja.channel.guild)
    ninja.channel
 if (ninja.member.hasPermission("MOVE_MEMBERS")) {
 if (ninja.mentions.users.size === 0) {
 return ninja.channel.send("``لاستخدام الأمر اكتب هذه الأمر : " +prefix+ "move [USER]``")
}
if (ninja.member.voiceChannel != null) {
 if (ninja.mentions.members.first().voiceChannel != null) {
 var authorchannel = ninja.member.voiceChannelID;
 var usermentioned = ninja.mentions.members.first().id;
var embed = new Discord.RichEmbed()
 .setTitle("Succes!")
 .setColor("#000000")
 .setDescription(`لقد قمت بسحب <@${usermentioned}> الى الروم الصوتي الخاص بك✅ `)
var embed = new Discord.RichEmbed()
.setTitle(`You are Moved in ${ninja.guild.name}`)
 .setColor("RANDOM")
.setDescription(`**<@${ninja.author.id}> Moved You To His Channel!\nServer --> ${ninja.guild.name}**`)
 ninja.guild.members.get(usermentioned).setVoiceChannel(authorchannel).then(m => ninja.channel.send(embed))
ninja.guild.members.get(usermentioned).send(embed)
} else {
ninja.channel.send("``لا تستطيع سحب "+ ninja.mentions.members.first() +" `يجب ان يكون هذه العضو في روالعضو ليس في روم الصوتي`")
}
} else {
 ninja.channel.send("**``انت لست في الروم الصوتي``**")
}
} else {
ninja.react("❌")
 }}});

/*
*/

client.on("message", (msg) => {
  if (msg.content.startsWith(prefix + "template")) {
    if (!msg.member.hasPermission('ADMINISTRATOR')) return msg.channel.send(new Discord.MessageEmbed() .setTitle("❌ **You Need `ADMINISTRATOR` Permission To Use This Command!**"))
        const embed = new Discord.MessageEmbed()
        .setDescription(`**
    <:WebDesign:876492352510910564> \`Anime Community\` -> [Use Template](https://discord.com/template/EnpARSu9J6jv)

    <:WebDesign:876492352510910564> \`PUBG Server\` -> [Use Template](https://discord.com/template/pUFmwUmvwhxr)

    <:WebDesign:876492352510910564> \`Bot Support Server\` -> [Use Template](https://discord.com/template/kxdjhhZveEPK)

    <:WebDesign:876492352510910564> \`Public Community\` -> [Use Template](https://discord.com/template/GXP3f2UZZEbK)
                            **`)
        msg.channel.send(embed)
    }
})

const shorten = require('isgd');
client.on('message', ninja => {
 if (ninja.content.startsWith(prefix + 'short')) {
   if (!ninja.channel.guild) return;
    ninja.channel
   if(!ninja.member.hasPermission('ADMINISTRATOR'))
    return ninja.channel.send('**ليس لديك صلاحيات**');
    let args = ninja.content.split(" ").slice(1);
  if (!args[0]) return ninja.channel.send(`${prefix}short <link>`)
  if (!args[1]) {
    shorten.shorten(args[0], function(res) {
      ninja.channel.send(`Link Shortcut : **${res}**`);
    })
  } else {
    shorten.custom(args[0], args[1], function(res) {
      if (res.startsWith('Error:')) return ninja.channel.send(`اختصار الرابط:**${res}**`);
      ninja.channel.send(`اختصار الرابط:**${res}**`);
    })
  }}
});

/**/

client.on('message', msg => {
    if (msg.content === prefix + 'setup colors' || msg.content === 'setup colors') {
        msg.guild.roles.create({
            data: {
                name: "1",
                color: "#FFB6C1",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "2",
                color: "#FFC0CB",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "3",
                color: "#FF69B4",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "4",
                color: "#FF1493",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "5",
                color: "#DB7093",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "6",
                color: "#C71585",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "7",
                color: "#E6E6FA",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "8",
                color: "#D8BFD8",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "8",
                color: "#DDA0DD",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "9",
                color: "#DA70D6",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "10",
                color: "#EE82EE",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "11",
                color: "#FF00FF",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "12",
                color: "#BA55D3",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "13",
                color: "#9932CC",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "14",
                color: "#9400D3",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "15",
                color: "#8A2BE2",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "16",
                color: "#8B008B",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "17",
                color: "#800080",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "18",
                color: "#9370DB",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "19",
                color: "#7B68EE",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "20",
                color: "#6A5ACD",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "21",
                color: "#483D8B",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "22",
                color: "#663399",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "23",
                color: "#4B0082",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "24",
                color: "#FFA07A",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "25",
                color: "#FA8072",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "26",
                color: "#E9967A",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "27",
                color: "#F08080",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "28",
                color: "#CD5C5C",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "29",
                color: "#DC143C",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "30",
                color: "	#FF0000",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "31",
                color: "#B22222",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "32",
                color: "#8B0000",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "33",
                color: "#FFA500",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "34",
                color: "#FF8C00",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "35",
                color: "#FF7F50",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "36",
                color: "#FF6347",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "37",
                color: "#FF4500",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "38",
                color: "#FFD700",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "39",
                color: "#FFFFE0",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "40",
                color: "#FFFACD",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "41",
                color: "#FAFAD2",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "42",
                color: "	#FFEFD5",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "43",
                color: "#FFE4B5",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "44",
                color: "#FFDAB9",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "45",
                color: "#EEE8AA",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "46",
                color: "#F0E68C",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "47",
                color: "#BDB76B",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "48",
                color: "#ADFF2F",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "49",
                color: "#7FFF00",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "50",
                color: "#7CFC00",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "51",
                color: "#00FF00",
                permissions: []
            }
        })

        msg.guild.roles.create({
            data: {
                name: "52",
                color: "#32CD32",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "53",
                color: "#98FB98",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "54",
                color: "#90EE90",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "55",
                color: "#00FA9A",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "56",
                color: "#00FF7F",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "57",
                color: "#3CB371",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "58",
                color: "#2E8B57",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "59",
                color: "#2E8B57",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "60",
                color: "#008000",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "61",
                color: "#006400",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "62",
                color: "#9ACD32",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "63",
                color: "#6B8E23",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "64",
                color: "#556B2F",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "65",
                color: "#66CDAA",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "66",
                color: "#8FBC8F",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "67",
                color: "#20B2AA",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "68",
                color: "#008B8B",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "69",
                color: "#008080",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "70",
                color: "#00FFFF",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "71",
                color: "#E0FFFF",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "72",
                color: "#AFEEEE",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "73",
                color: "#7FFFD4",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "74",
                color: "#40E0D0",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "75",
                color: "#48D1CC",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "76",
                color: "#00CED1",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "77",
                color: "#5F9EA0",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "78",
                color: "#4682B4",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "79",
                color: "#B0C4DE",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "80",
                color: "#ADD8E6",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "81",
                color: "#B0E0E6",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "82",
                color: "#87CEFA",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "83",
                color: "#87CEEB",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "84",
                color: "#6495ED",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "85",
                color: "#00BFFF",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "86",
                color: "#1E90FF",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "87",
                color: "#4169E1",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "88",
                color: "#0000FF",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "89",
                color: "#0000CD",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "90",
                color: "#00008B",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "91",
                color: "#000080",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "92",
                color: "#191970",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "93",
                color: "#FFF8DC",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "94",
                color: "#FFEBCD",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "95",
                color: "#FFE4C4",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "96",
                color: "#FFDEAD",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "97",
                color: "#F5DEB3",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "98",
                color: "#DEB887",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "99",
                color: "#D2B48C",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "100",
                color: "#BC8F8F",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "101",
                color: "#F4A460",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "102",
                color: "#DAA520",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "103",
                color: "#B8860B",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "104",
                color: "#CD853F",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "105",
                color: "#D2691E",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "106",
                color: "#808000",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "107",
                color: "#8B4513",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "108",
                color: "#A0522D",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "109",
                color: "#A52A2A",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "110",
                color: "#800000",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "111",
                color: "#FFFFFF",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "112",
                color: "#FFFAFA",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "113",
                color: "#F0FFF0",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "114",
                color: "#F5FFFA",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "115",
                color: "#F0FFFF",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "116",
                color: "#F0F8FF",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "117",
                color: "#F8F8FF",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "118",
                color: "#F5F5F5",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "119",
                color: "#FFF5EE",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "120",
                color: "#F5F5DC",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "121",
                color: "#FDF5E6",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "122",
                color: "#FFFAF0",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "123",
                color: "#FFFFF0",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "124",
                color: "#FAEBD7",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "125",
                color: "#FAF0E6",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "126",
                color: "#FFF0F5",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "127",
                color: "#FFE4E1",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "128",
                color: "#DCDCDC",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "129",
                color: "#D3D3D3",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "130",
                color: "#C0C0C0",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "131",
                color: "#f7f7f7",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "132",
                color: "#b2b2b2",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "133",
                color: "#6f6c6c",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "134",
                color: "#4d4646",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "135",
                color: "#4c4c4c",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "136",
                color: "#2F4F4F",
                permissions: []
            }
        })
        msg.guild.roles.create({
            data: {
                name: "137",
                color: "#040000",
                permissions: []
            }
        })
        const embed1 = new Discord.MessageEmbed()
            .setTitle("🕑 **Preparing your server color rules ...**")
            .setFooter(`Request By ${msg.author.username}`)
            .setTimestamp()
        const embed2 = new Discord.MessageEmbed()
            .setTitle("✅ **Your colors is ready**")
            .setFooter(`Request By ${msg.author.username}`)
            .setTimestamp()
        msg.channel.send(embed1).then(m => {
            setTimeout(() => {
                m.delete()
                m.channel.send(embed2)
            }, 30000)
        })
    }
})

/**
--> Temp Channel
 */
var temporary = [];
client.on('voiceStateUpdate', async (oldMember, newMember) => {
  let category = client.channels.cache.get('CATEGORY ID');
  let voiceCH = client.channels.cache.get('CHANNEL ID'); 
    if (newMember.channel == voiceCH) {
        await newMember.guild.channels.create(`${newMember.member.displayName}'s Channel`, {
            type: 'voice', parent: category, userLimit: ('MAX USERS IN CHANNEL')
        }).then(async channel => {
            temporary.push({ newID: channel.id, guild: channel.guild });
            await newMember.setChannel(channel.id);
        });
    }
    if (temporary.length > 0) for (let i = 0; i < temporary.length; i++) {
        let ch = client.channels.cache.get(temporary[i].newID);
        if (ch.members.size === 0) {
            await ch.delete();
            return temporary.splice(i, 1);
        }
    }
});

/*
--> Profile (ProBot)
*/

client.on("message", message => {
  let args = message.content.split(" ");
  if (message.content.startsWith(prefix + "profile")) {
    let member = message.mentions.users.first();

    if (args[0] && !args[1]) {
      message.channel.startTyping();
      setTimeout(() => {
        message.channel.stopTyping();
      }, Math.random() * (1 - 3) + 1 * 1000);
      message.channel.send({
        files: [
          {
            name: "probot.png",
            attachment: `https://api.probot.io/profile/${message.author.id}`
          }
        ]
      });
    }
    if (member) {
      message.channel.startTyping();
      setTimeout(() => {
        message.channel.stopTyping();
      }, Math.random() * (1 - 3) + 1 * 1000);
      message.channel.send({
        files: [
          {
            name: "probot.png",
            attachment: `https://api.probot.io/profile/${member.id}`
          }
        ]
      });
    } else if (args[1] && !member) {
      nitro.fetchUser(args[1]).then(userr => {
        message.channel.stopTyping();
        setTimeout(() => {
          message.channel.stopTyping();
        }, Math.random() * (1 - 3) + 1 * 1000);
        message.channel.send({
          files: [
            {
              name: "probot.png",
              attachment: `https://api.probot.io/profile/${userr.id}`
            }
          ]
        });
      });

    }
  }
}); 

client.login(config.TOKEN)
