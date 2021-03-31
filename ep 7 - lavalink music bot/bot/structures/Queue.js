const { TextChannel, MessageEmbed, UserFlags } = require("discord.js");
const { lavacordManager } = require("..");
const axios = require('axios').default;
const { msToHMS } = require('../utils')

const urlRegex = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);

module.exports = class Queue {
    /**
     * 
     * @param {String} guildID 
     * @param {String} channelID 
     * @param {TextChannel} textChannel 
     */
    constructor(guildID, channelID, textChannel) {
        this.guildID = guildID;
        this.channelID = channelID;
        this.textChannel = textChannel;

        this.queue = [];
        this.player = null;
        this.currentlyPlaying = null;
    }

    async search(searchTerm) {
        const node = lavacordManager.idealNodes[0];

        const params = new URLSearchParams();
        params.append('identifier', urlRegex.test(searchTerm) ? searchTerm : `ytsearch:${searchTerm}`);

        const data = await axios(`http://${node.host}:${node.port}/loadtracks?${params}`, {
            headers: {
                Authorization: node.password
            }
        });

        return data.data.tracks ?? [];
    }

    async play(track) {
        this.queue.push(track);

        if(!this.currentlyPlaying) {
            this._playNext();
            return false;
        } else {
            return true;
        }
    }

    async _playNext() {
        const nextSong = this.queue.shift();
        this.currentlyPlaying = nextSong;

        if(!nextSong) {
            this.player = null;
            this.currentlyPlaying = null;

            await lavacordManager.leave(this.guildID);
            this.textChannel.send('Finished playing.');
            return;
        }

        this.textChannel.send(
            new MessageEmbed()
                .setTitle("🎶 Now Playing: " + nextSong.info.title)
                .addFields([
                    { inline: true, name: "Author", value: nextSong.info.author },
                    { inline: true, name: "Length", value: msToHMS(nextSong.info.length) },
                    { inline: true, name: "Link", value: nextSong.info.uri }
                ])
                .setColor("00ff00")
        );

        if(!this.player) {
            this.player = await lavacordManager.join({
                guild: this.guildID,
                channel: this.channelID,
                node: lavacordManager.idealNodes[0].id
            });

            this.player.on('end', data => {
                if(data.reason === "REPLACED" || data.reason === "STOPPED") return;

                this._playNext();
            });
        }

        await this.player.play(nextSong.track);
    }
}