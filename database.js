import sqlite3 from 'sqlite3';
import  { createReadStream } from 'node:fs'
import * as readline from 'readline'
import { exit } from 'node:process';
const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE , (err) => {
    console.log("im running")
    if(err){
        console.error(err.message)
        throw err
        }else{
          console.log('Connected to SQLite database')
        //  getLineByLine();
        }
})

async function getLineByLine() {
const fileStream = createReadStream("./items.txt")


const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
})

let values = []
let i = 0
for await (const line of rl) {
    values.push(line)
    i += 1

    if(i == 5){
        db.run('INSERT INTO items (item_name, item_type, item_rarity, attunement, notes, value) VALUES (?,?,?,?,?,5)', values, (err) => {
            if(err) console.log(err)
        })
        console.log(values[3])
        values = []
        i = 0
    }
}
}

export {db}