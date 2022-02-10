const { channel } = require('diagnostics_channel');
const { Client, Intents, Collection} = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const config = require("./config.json");

const fs = require('fs');

client.commands = new Collection();

const commandFiles = fs.readdirSync('./comandos/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./comandos/${file}`);

    client.commands.set(command.name, command);
}

client.on("ready", () => {
    console.log(`Bot iniciado, com ${client.users.size} usuários.`);
});

client.on("guildCreate", build => {
    console.log(`O bot entrou no servidor: ${guild.name}`);
});

client.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.type == "dm") return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const comando = args.shift().toLowerCase();

    if (comando == "ping") {
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! A Latência é ${m.createdTimestamp - message.createdTimestamp}ms.`)
    }

    if (comando == "salve") {
        const m = await message.channel.send("Família?");
        m.edit(`Família? Nha, lugar de Nazi é no inferno =)`);
    }

    if(comando == 'play'){
        client.commands.get('play').execute(message, args);
    }
});

client.login(config.token);