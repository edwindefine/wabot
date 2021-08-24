const fs = require('fs')

const miniThumbnail = fs.readFileSync('./assets/media/karma_akabane_mini.jpg')
const {ownerNumber, ownerName, botName, mediaUrl} = JSON.parse(fs.readFileSync('./config.json'))

module.exports = {
    
}
