const discord = require('discord.js');
const { queues } = require('..');
const { msToHMS } = require('../utils');

module.exports = {
    /**
     * 
     * @param {string[]} args 
     * @param {discord.Message} message 
     */
    run: async (args, message) => {
        if(!queues[message.guild.id]) return message.channel.send('Nothing is playing');

        const song = queues[message.guild.id].currentlyPlaying;

        message.channel.send(
            new discord.MessageEmbed()
                .setTitle("🎶 Currently playing: " + song.info.title)
                .addFields([
                    { inline: true, name: "Author", value: song.info.author },
                    { inline: true, name: "Length", value: msToHMS(song.info.length) },
                    { inline: true, name: "Link", value: song.info.uri }
                ])
                .setColor("00ff00")
        );
    },

    command: 'np'
}