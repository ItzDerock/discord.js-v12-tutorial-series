const discord = require('discord.js');
const { queues } = require('..');
const { msToHMS } = require('../utils');

module.exports = {
    /**
     * 
     * @param {string[]} args 
     * @param {discord.Message} message 
     */
    run: async  (args, message) => {
        if(!queues[message.guild.id]) return message.channel.send('Nothing is playing');

        const next = queues[message.guild.id].queue;

        const text = next.map((song, index) => `${++index}) ${song.info.title} - ${song.info.author} - ${msToHMS(song.info.length)}`);

        message.channel.send(
            new discord.MessageEmbed()
                .setTitle("📜 Queue")
                .setDescription(`\`\`\`\n${text ?? "Nothing in queue"}\n\`\`\``)
                .setColor("00ff00")
        );
    },

    command: 'queue'
}