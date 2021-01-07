require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const axios = require('axios');
const cheerio = require('cheerio');

const TOKEN = process.env.TOKEN;
const CTFD_URL= process.env.CTFD_URL;

bot.login(TOKEN);

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
});

let lastCall = Date.now()

bot.on('message', msg => {
    if (msg.content === '!!top10') {
        let timeout = Date.now() - lastCall
        if (timeout >= 300000) {
            axios(CTFD_URL).then(response => {
                const html = response.data;
                const $ = cheerio.load(html);
                let scoreboard = $(".table.table-striped > tbody > tr").map((index, element) => {
                    if (index <= 9) {
                        return `${$($(element).find("th.text-center")[0]).text()} - ${$(element).find("a").text().trim()} - ${$($(element).find("td")[1]).text()}`
                    }
                }).get();
                msg.channel.send(scoreboard);
            }).catch(console.error);
        }
    }
});
