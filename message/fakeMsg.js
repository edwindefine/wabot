const fs = require('fs')

let dataBot = JSON.parse(fs.readFileSync('./database/data_bot.json'))

const miniThumbnail = fs.readFileSync(dataBot.fakeImg)
const {ownerNumber, ownerName, botName, mediaUrl} = JSON.parse(fs.readFileSync('./config.json'))

module.exports = {
    
}
