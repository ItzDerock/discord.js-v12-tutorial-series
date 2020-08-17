const Discord = require("discord.js");
const enmap = require("enmap");
const config = require("./config.json");
const ms = require("ms")

const client = new Discord.Client();
const eco = new enmap({
    name: "economy",
    cloneLevel: "deep",
    fetchAll: false,
    autoFetch: true
});

const cooldowns = new enmap({
    name: "cooldowns",
    cloneLevel: "deep",
    fetchAll: false,
    autoFetch: true
});

client.on("ready", () => {
    console.log("Ready")
});

client.on('message', async message => {
    if(!message.content.startsWith(config.prefix)) return;
    if(message.author.bot) return;
    if(!message.guild) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command == "daily") {
        const cooldowndata = await cooldowns.get(`${message.author.id}-${message.guild.id}-daily`);
        if(parseInt(cooldowndata) > Date.now()) return message.reply(`Please wait ${ms(parseInt(cooldowndata) - Date.now(), {long: true})}`)

        await eco.ensure(`${message.author.id}-${message.guild.id}`, 0);
        const currentBalance = await eco.get(`${message.author.id}-${message.guild.id}`);
        eco.set(`${message.author.id}-${message.guild.id}`, currentBalance + 5);

        message.channel.send(new Discord.MessageEmbed()
            .setTitle("💵 Daily Reward!")
            .setDescription(`You have claimed your daily reward! Your new balance is now ${currentBalance + 5}!`).setColor("00ff00")
        )

        cooldowns.set(`${message.author.id}-${message.guild.id}-daily`, Date.now() + ms("1d"))
    }

    if(command == "bal") {
        await eco.ensure(`${message.author.id}-${message.guild.id}`, 0);
        const currentBalance = await eco.get(`${message.author.id}-${message.guild.id}`);

        message.channel.send(new Discord.MessageEmbed()
            .setTitle("💵 Your Balance!")
            .setDescription(`Your current balance is \`${currentBalance}\``).setColor("00ff00")
        )
    }
});

client.login(config.token)