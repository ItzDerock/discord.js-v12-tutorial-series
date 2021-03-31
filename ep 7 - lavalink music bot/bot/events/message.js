const { commands } = require("..");
const config = require('../config.json')
const discord = require('discord.js');

module.exports = {

    /**
     * 
     * @param {discord.Message} message 
     */
    run: message => {
        if(!message.guild) return;
        if(message.author.bot) return;

        if(!message.content.startsWith(config.prefix)) return;

        const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        const loadedCommand = commands.get(command);
        if(!loadedCommand) return;
        
        loadedCommand(args, message);
    },

    eventName: 'message'
}