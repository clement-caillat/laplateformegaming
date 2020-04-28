const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require("fs");

client.login('NzA0NDU5ODk0MDQzOTY3NTE5.XqddnA.yaPuDlKOjN_Uqplt2j9azsQfJqo');

client.on('ready', () => {
    console.log(`${client.user.tag}`);
    client.user.setActivity('_ghelp', { type: 'PLAYING' });
})


function color(){
    return "#" + Math.floor(Math.random()*16777215).toString(16);
}


const pre = "_g";

client.on('message', message => {
    var args = message.content.slice(pre.lenght).split(/ +/);
    console.log(message.author.tag + " : " + message.content);
    
    if(message.content.startsWith(pre + "addgame")){
        if(!message.member.hasPermission("MANAGE_ROLES")) return message.reply("Tu n'as pas la permission");
        if(!args.length) return message.reply("Saisis le nom du jeu");
        args.shift();
        name = args.join(' ');
        colore = color();
        var gamex = fs.readFileSync('games.json').toString();
        var gameparse = JSON.parse(gamex);

        gameparse.jeux.push(({"nom": `${name}`}));
        fs.writeFile('games.json', JSON.stringify(gameparse), function(err){
            if(err) throw err;
        })

        message.guild.roles.create({
            data: {
                name: `${name}`,
                color: colore,
            }
        })
        .then(console.log)
        .catch(console.error);
        let embed = new Discord.MessageEmbed()
            .setTitle('Nouveau jeu ajouté')
            .setColor(colore)
            .setDescription(`Le jeu ${name} a été ajouté`);
        message.channel.send(embed);
    }

    if(message.content.startsWith(pre + "jeux")){
        message.reply(getGames());
    }

    if(message.content.startsWith(pre + "iplay")){
        args.shift();
        var game = args.join(' ');
        if(!args.length) return message.reply(getGames());
        var roles = message.guild.roles.cache;
        var role = roles.find(role => role.name === game);
        if(!role) return message.reply("Jeu non enregistré");
        var id = role.id;
        if(message.member.roles.cache.has(id)) return message.reply("Tu as déjà indiqué que tu jouais à " + role.name);
        message.member.roles.add(id);
        message.reply("Tu fais maintenant parti des joueurs " + game);
    }

    if(message.content.startsWith(pre + "whoplays")){
        args.shift();
        var game = args.join(' ');
        var roles = message.guild.roles.cache;
        var role = roles.find(role => role.name === game);
        if(!role) return message.reply("Jeu non enregistré");
        var count = role.members.size;
        let embed = new Discord.MessageEmbed()
            .setTitle('Membres qui jouent à ' + role.name)
            .setColor(role.color)
            .addFields({name: "Nombre", value: `${count} joueur(s)`});
        message.reply(embed);
    }

    if(message.content.startsWith(pre + "help")){
        let embed = new Discord.MessageEmbed()
            .setTitle('Commandes')
            .setColor(color())
            .addFields({name: "_gaddgame + <jeu>", value: "Ajoute un jeu (Clément uniquement)"})
            .addFields({name: "_gjeux", value: "Affiche les jeux enregistrés"})
            .addFields({name: "_giplay + <jeu>", value: "Indique le jeu auquel vous jouez"})
            .addFields({name: "_gwhoplays + <jeu>", value: "Affiche le nombre de membres qui jouent au jeu"})
        message.reply(embed);
    }

});

function getGames(){
    let embedgame = new Discord.MessageEmbed()
            .setTitle('Jeux enregistrés')
            .setColor(color())
            .setDescription('Liste des jeux enregistrés sur le serveur')
        const result = fs.readFileSync('games.json').toString();
        var games = JSON.parse(result);
        games.jeux.forEach(jeu => {
            embedgame.addFields({name: "Jeu", value: `${jeu.nom}`});
        });
        return embedgame;
}