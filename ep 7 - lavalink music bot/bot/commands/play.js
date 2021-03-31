const discord = require('discord.js');
const { queues } = require('..');
const Queue = require('../structures/Queue');
const { msToHMS } = require('../utils');

module.exports = {
    /**
     * 
     * @param {string[]} args 
     * @param {discord.Message} message 
     */
    run: async (args, message) => {
        if(!args[0]) return message.channel.send("Usage: `play <url/song title>`");
        if(!message.member.voice.channel.id) return message.channel.send(`You must be in a voice channel!`);

        if(!queues[message.guild.id])
            queues[message.guild.id] = new Queue(message.guild.id, message.member.voice.channel.id, message.channel);

        const [ song ] = await queues[message.guild.id].search(args.join(' '));
        if(!song) return message.channel.send(`Unknown song.`);

        const isAdded = await queues[message.guild.id].play(song);

        if(isAdded) {
            message.channel.send(
                new discord.MessageEmbed()
                    .setTitle("🎶 Added to queue: " + song.info.title)
                    .addFields([
                        { inline: true, name: "Author", value: song.info.author },
                        { inline: true, name: "Length", value: msToHMS(song.info.length) },
                        { inline: true, name: "Link", value: song.info.uri }
                    ])
                    .setColor("00ff00")
            )
        }
    },

    command: 'play'
}