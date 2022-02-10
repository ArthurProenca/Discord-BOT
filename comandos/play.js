const { joinVoiceChannel } = require("@discordjs/voice");

const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { VoiceChannel } = require("discord.js");


module.exports = {
    name: 'play',
    description: 'Bora ouvir musiquinha?',
    async execute(message, args) {
        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel) {
            return message.channel.send('Você precisa estar num canal, burre');
        }
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) {
            return message.channel.send('Você não tem permissão pra conectar, minion');
        }
        if (!permissions.has('SPEAK')) {
            return message.channel.send('Você não tem permissão pra falar, minion');
        }

        const connection = await voiceChannel.join();
        const videoFinder = async (query) => {
            const videoResult = await ytSearch(query);

            return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
        }
        const video = await videoFinder(args.join(' '));

        if (video) {
            const stream = ytdl(video.url, { filter: 'audioonly' });
            connection.play(stream, { seek: 0, volume: 1 })
                .on('finish', () => {
                    voiceChannel.leave();
                });

            await message.reply(`:thumbsup: Lançando a braba ${video.title}`);
        } else {
            message.channel.send('Achei porra nenhuma não');
        }
    }
}