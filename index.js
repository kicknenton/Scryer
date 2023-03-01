import { Client, GatewayIntentBits, Routes } from 'discord.js';
import {config } from 'dotenv';
import { REST } from '@discordjs/rest'
import {SlashCommandBuilder} from '@discordjs/builders'
import { readFile } from 'node:fs'
import { db } from './database.js';

config(); //loads tokens and ID's from .env file
const TOKEN = process.env.SCRYER_TOKEN
const CLIENT_ID = process.env.CLIENT_ID
const GUILD_ID = process.env.GUILD_ID

const client = new Client({
    intents:[
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]})

    const rest = new REST({version: '10' }).setToken(TOKEN)

    var helpFile = ""

client.on('ready', () => {
    readFile('./help.txt', "utf8",  (err, data) => {
        if(err) throw err;
        helpFile = data
    })

       
})


client.on('interactionCreate', (interaction) => {
    if(!interaction.isChatInputCommand()) {
        return
    }
    if(interaction.isCommand)
        interaction.reply({content: helpFile})
    
})


async function main() {

   //db.each(`SELECT * FROM items`, [], (err, row) => {
    //if(err) console.log("some error")

    //console.log(row.item_name)

   //})

    const commands = [
        {
            name:'help',
            description:'Receive a list of commands and their arguments'
        }
    ];
    try {
        console.log('adding / commands')
        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
            body: commands,
        });
        client.login(TOKEN);
    }catch(err){
        console.log(err)
    }
}

main();
