const discord = require('discord.js');
const { queues } = require('..');

module.exports = {
    /**
     * 
     * @param {string[]} args 
     * @param {discord.Message} message 
     */
    run: async (args, message) => {
        if(!message.member.voice.channel.id) return message.channel.send("You must be in a voice channel!");
        if(!queues[message.guild.id]) return message.channel.send('Nothing is playing!');

        queues[message.guild.id]._playNext();
    },

    command: 'skip'
}