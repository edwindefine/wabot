//================================
// BY edwindefine
// Recode Boleh asal isi nama gua juga :)
// Nyolong? dosa loh
// Ada yang ditanyakan? chat gua
// Thanks, jangan dihapus ya, kalau recode pun isiin nama gua juga
//================================

//============[ THX TO ]============
// SEMUANYA :)
//================================

//=========[ ERROR FEATURES ]===========
// [❗] GAADA
//================================

//=========[ API USED ]=========
// https://api.xteam.xyz
// https://nekos.life
// https://tinyurl.com
// https://edwndefine.herokuapp.com
// https://hardianto-chan.herokuapp.com/
//================================

const ApiKey = 'edwinkey'

//✔️
//❌
//❗

/***************** MODULES *****************/
const { 
    WAConnection, 
    MessageType, 
    Mimetype,
    Presence, 
    WA_DEFAULT_EPHEMERAL
} = require('@adiwajshing/baileys')
const fs = require('fs')
const ffmpeg = require('fluent-ffmpeg')
const imageToBase64 = require('image-to-base64')
const { exec, spawn } = require("child_process");
const moment = require("moment-timezone")
const got = require('got')
const axios = require('axios')
const request = require('request');
const hx = require('hxz-api');
const imgbb = require("imgbb-uploader");
const gtts = require('node-gtts');
const speed = require('performance-now')
const ig = require('insta-fetcher')

/***************** UTILS *****************/
const { 
    text,
    extendedText, 
    contact, 
    contactsArray, 
    location, 
    liveLocation, 
    image, 
    video, 
    sticker, 
    document, 
    buttonsMessage,
    groupInviteMessage,
    audio, 
    product 
} = MessageType
const {
    fMsg, 
    fVn, 
    fImage, 
    fVideo, 
    fToko, 
    fTroli, 
    fGif, 
    fLoc, 
    fLiveLoc, 
    fDoc, 
    fInvite, 
    fSticker,
    fKontak
} = require('./fakeReply')
const {createExif, execSticker, execWebp} = require('../sticker/function')
const {getBuffer, pickRandom, start, info, success, close, getGroupAdmins, getGroupMembersId} = require('../lib/function')
const {color, bgColor, hexColor} = require('../lib/color')
const { menu } = require('./menu');
const {addResponse, checkResponse, deleteResponse} = require('../lib/response');
const { yta, ytv, igdl, upload, formatDate } = require('../lib/ytdl')
const { webp2mp4File } = require('../lib/webp2mp4')
const mess = require('./respons.js')


/******** JSON AND ASSETS ********/
const {ownerNumber, ownerName, botName, mediaUrl} = JSON.parse(fs.readFileSync('./config.json'))
let dataBot = JSON.parse(fs.readFileSync('./database/data_bot.json'))
let stickerCommand = JSON.parse(fs.readFileSync('./sticker/command.json'))
let banchat = JSON.parse(fs.readFileSync('./database/banchat.json'))
let antiLink = JSON.parse(fs.readFileSync('./database/antilink.json'))
let antiVirtex = JSON.parse(fs.readFileSync('./database/antivirtex.json'))
let responseDb = JSON.parse(fs.readFileSync('./database/response.json'))

let imagePreview = fs.readFileSync(dataBot.imgprev)

moment.tz.setDefault("Asia/Makassar").locale("id");

module.exports = async (chatUpdate, client) => {
    if (!chatUpdate.hasNewMessage) return
    const msg = chatUpdate.messages.all()[0]
    if (!msg.message) return
    if (msg.key && msg.key.remoteJid == 'status@broadcast') return
    msg.message = (Object.keys(msg.message)[0] === 'ephemeralMessage') ? msg.message.ephemeralMessage.message : msg.message
    if(msg.status === 2) return //the reply of the bot
    
    // console.log(msg)//msg debugging

    const type = Object.keys(msg.message)[0]
    const from = msg.key.remoteJid
    const content = JSON.stringify(msg.message)
    const isListResponseMessage = type === 'listResponseMessage'
    const isButtonsResponseMessage = type === 'buttonsResponseMessage'
    let userListResponse = (type === 'listResponseMessage') ? msg.message.listResponseMessage.title : ''
    let userButtonResponse = (type == 'buttonsResponseMessage') ? msg.message.buttonsResponseMessage.selectedDisplayText : ''
    let body = (type === 'conversation') ? msg.message.conversation : (type == 'imageMessage') ? msg.message.imageMessage.caption : (type == 'videoMessage') ? msg.message.videoMessage.caption : (type == 'extendedTextMessage') ? msg.message.extendedTextMessage.text : '' 
    const args = body.split(" ")
    let q = body.slice(args[0].length+1)
    const pureCommand = args[0]
    const thePrefix = dataBot.prefix !== 'multi' ? dataBot.prefix : /^[π×£€¥!#$^./\\©^]/.test(pureCommand) ? pureCommand.match(/^[π×£€¥!#$^./\\©^]/gi) : '-'
    // const thePrefix = body && body.length>1 ? body[1].toUpperCase() : ''
    const isCmd = pureCommand ? pureCommand[0] == thePrefix : false
    const userPrefix = pureCommand[0]
    let command = pureCommand.slice(1, pureCommand.length).toLowerCase()

    
    /******************** VALIDATOR ********************/
    
    const isGroup = from.includes('@g.us')
    const sender = msg.key.fromMe ? client.user.jid : isGroup ? msg.participant : msg.key.remoteJid
    const isOwner = ownerNumber.includes(sender)
    let isPublic = dataBot.isPublic

    const timeWit = moment().tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
    const timeWita = moment().tz('Asia/Makassar').format('DD/MM HH:mm:ss')
    const timeWib = moment().tz('Asia/Jayapura').format('DD/MM HH:mm:ss')
    const botNumber = client.user.jid
    const groupMetadata = isGroup ? await client.groupMetadata(from) : ''
    const groupName = isGroup ? groupMetadata.subject : ''
    const groupDesc = isGroup ? groupMetadata.desc : ''
    const groupId = isGroup ? groupMetadata.jid : ''
    const groupMembers = isGroup ? groupMetadata.participants : ''
    const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
    const groupMembersId = getGroupMembersId(groupMembers)
    const isBanchat = isGroup ? banchat.includes(from) : false
    const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
    const isGroupAdmins = groupAdmins.includes(sender) || false
    const isAntiLink = isGroup ? antiLink.includes(from) : false
    const isAntiVirtex = isGroup ? antiVirtex.includes(from) : false

    const pushname = client.contacts[sender] != undefined ? client.contacts[sender].vname || client.contacts[sender].notify : sender.split("@")[0]//undefined
    const isMedia = (type === 'imageMessage' || type === 'videoMessage')
    const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
    const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
    const isQuotedAudio = type === 'extendedTextMessage' && content.includes('audioMessage')
    const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
    
    /******************** END VALIDATOR ********************/

    
    //msg debuging 2
    // if(!isOwner) return
    // else {
    // console.log(msg)
    //     console.log(msg.message.productMessage.product)
    //     console.log(msg.message.productMessage.contextInfo)
    // }

    /***************** MESSAGE PROCESSED *****************/
    const cmdSuccess = (teks) => {return console.log(hexColor('  >   ', '#42ba5a')+hexColor(teks, '#42ba96'))}
    const cmdErr = (teks) => {return console.log(hexColor('  x   ', '#e30508')+hexColor(teks, '#F32013'))}
    const reply = (teks) => {client.sendMessage(from, teks, text, {quoted:msg})}
    const reply2 = (teks) => {client.sendMessage(from, teks, text, {quoted: msg, thumbnail: fs.readFileSync(`./assets/media/karma_akabane_mini.jpg`)})}//terlihat image saat reply
    const fReply = (teks) => {client.sendMessage(from, teks, text, {quoted:fMsg(2, 'Bot Verified'), contextInfo:{mentionedJid:sender}})}

    const sendMediaURL = async(to, url, teks="", mids=[]) =>{
        if(mids.length > 0) teks = normalizeMention(to, teks, mids)
        const fn = Date.now() / 10000;
        const filename = fn.toString()
        let mime = ""
        function download(uri, filename, callback) {
            request.head(uri, function (err, res, body) {
                mime = res.headers['content-type']
                request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
            });
        };
        download(url, filename, async function () {
            console.log('done');
            let media = fs.readFileSync(filename)
            let type = mime.split("/")[0]+"Message"
            if(mime === "image/gif"){
                type = MessageType.video
                mime = Mimetype.gif
            }
            if(mime.split("/")[0] === "audio") mime = Mimetype.mp4Audio
            client.sendMessage(to, media, type, { quoted: msg, mimetype: mime, caption: teks,contextInfo: {"mentionedJid": mids}})
            fs.unlinkSync(filename)
        });
    }   

    /*message option*/
    //sendEphemeral: true //agar pesan terhapus setelah 7 hari
    //contextInfo:{forwardingScore: 500, isForwarded: true},//cara mengirim pesan yang terlihat diteruskan 

    /***************** END MESSAGE PROCESSED *****************/


    
    /********** FUNCTION **********/

    const vCard = 'BEGIN:VCARD\n' // metadata of the contact card
        + 'VERSION:3.0\n' 
        + 'FN:Edwin\n' // full name
        + 'ORG:NASA CORPORATION✓;\n' // the organization of the contact
        + 'TEL;type=CELL;type=VOICE;waid=6285829271476:+62 858-2927-1476\n' // WhatsApp ID + phone number
        + 'END:VCARD'

    function convertNumber(nomor){
        let result = '';
        if(nomor.startsWith("0")) result = nomor.replace("0", "62")
        else result = nomor
        while(result.includes("+") || result.includes("-") || result.includes(" ") || result.includes("(") || result.includes(")")){
            if(result.includes('+')) result = nomor.replace("+", "") 
            if(result.includes('-')) result = result.replace("-", "") 
            if(result.includes(' ')) result = result.replace(" ", "")
            if(result.includes('(')) result = result.replace("(", "")
            if(result.includes(')')) result = result.replace(")", "")
        }

        return result
    }
    const getRandom = (maxNumber) => {
        return Math.floor(Math.random()*maxNumber)
    }

    const isUrl = (url) => {
        return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%+.~#?&/=]*)/, 'gi'))
    }
    const fakeUrl = (title = `Shut Up your Mouth`, thumbnailUrl = mediaUrl.karma_akabane_mini_wm, url = '', mentions) => {
        return{
            sendEphemeral: true,
            mentionedJid: [mentions],
            "externalAdReply": {
                "title": title,
                "body": ``,
                "previewType": "PHOTO",
                "thumbnailUrl": thumbnailUrl,
                "thumbnail": '',
                "sourceUrl": url
            }
        }
    }

    /********** END FUNCTION **********/
    


    /******************** COMMAND ********************/

    /****** Checker ******/
    //Auto Response
    if(!isGroup){//khusus untuk private chat
        if(dataBot.autoResponse){
            for (let i = 0; i < responseDb.length ; i++) {
                if (body.toLowerCase() === responseDb[i].pesan) {
                    client.sendMessage(from, responseDb[i].balasan, text, {quoted: msg})
                }
            }
        }
    }
    //antilink
    if (body.includes("https://chat.whatsapp.com/")) {
        if (!isGroup) return
        if (!isAntiLink) return
        if (isGroupAdmins) return
        let pelanggar = `${sender.split("@")[0]}@s.whatsapp.net`
        reply(` *「 GROUP LINK DETECTOR 」*\nKamu mengirimkan link grup lain, maaf kamu di kick dari grup :(`)
        setTimeout(() => {
            client.groupRemove(from, [pelanggar])
                .catch((e) => { reply(`Jadikan Bot Admin terlebih dahulu untuk menggunakan ANTILINK!`) })
        }, 0)
    }
    //anti virtex
    if (body.length > 3500) {
        if (!isGroup) return
        if (!isAntiVirtex) return
        if (isGroupAdmins) return
        reply('Tandai telah dibaca\n'.repeat(300))
        reply(`*「 VIRTEX DETECTOR 」*\n\nKamu nakal si! Ngapain kirim virtex? \nMaaf tapi aku harus mengeluarkan kamu...\nSelamat tingal~`)
        console.log(color('[KICK]', 'red'), color('Received a virus text!', 'yellow'))
        client.groupRemove(from, [sender])
            .catch((e) => { reply(`Jadikan Bot Admin terlebih dahulu untuk menggunakan ANTIVIRTEX!`) })
    }
    if (isBanchat){
        if (!isOwner)return 
    }

    /*** SetPrefix Bot ***/
    if(pureCommand.toLowerCase() === 'setprefix'){
        if(!isOwner) return
        if(!q) return reply('prefixnya?')
        if(q === 'default' || q === 'multi'){
            dataBot.prefix = 'multi'
            fs.writeFileSync('./database/data_bot.json', JSON.stringify(dataBot))
            dataBot = JSON.parse(fs.readFileSync('./database/data_bot.json'))
            fReply(`SetPrefix「 *MULTI-PREFIX* 」`)
        } else {
            if(q.length > 1) return reply('Prefix cuma bisa *1 huruf/angka*, atau bisa mengetik *multi* untuk menggunakan multi prefix!')
            dataBot.prefix = q
            fs.writeFileSync('./database/data_bot.json', JSON.stringify(dataBot))
            dataBot = JSON.parse(fs.readFileSync('./database/data_bot.json'))
            fReply(`SetPrefix「 *${q}* 」`)
        }
    }

    // return if is !cmd and !public
    if (!isListResponseMessage && !isButtonsResponseMessage && !isOwner && !isPublic) return 
    if (!isListResponseMessage && !isButtonsResponseMessage && type!=='stickerMessage' && !isCmd) return
    //


    /** Sticker Command **/
    //handle sticker command
    if(type === 'stickerMessage'){
        for(let i = 0; i<stickerCommand.length; i++){
            if(msg.message.stickerMessage.fileSha256.toString() == stickerCommand[i].key){
                if(stickerCommand[i].value.split(" ").length<2) command = stickerCommand[i].value
                else {
                    const commandSplit = stickerCommand[i].value.split(" ")
                    command = commandSplit[0]
                    q = stickerCommand[i].value.slice(commandSplit[0].length+1)
                    args[1] = commandSplit[1]
                    args[2] ? commandSplit[2] : undefined
                    args[3] ? commandSplit[3] : undefined
                }
            }
        }
    }

    /*********** COMMAND LOG ************/
    if(type === 'stickerMessage' && command){
        if(msg.key.fromMe){
            if(!isGroup) console.log(color('[CMD]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YYYY HH:mm:ss'), 'yellow'), hexColor('StickerCmd', '#f08c29'), color(`${command} [${args.length}]`), 'from', hexColor('fromMe', '#9ef542'), hexColor('Private chat', '#34ebc6'))
            if(isGroup) console.log(color('[CMD]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YYYY HH:mm:ss'), 'yellow'), hexColor('StickerCmd', '#f08c29'), color(`${command} [${args.length}]`), 'from', hexColor('fromMe', '#9ef542'), 'in', color(groupName, 'blue'))
        }
        else{
            if(!isGroup) console.log(color('[CMD]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YYYY HH:mm:ss'), 'yellow'), hexColor('StickerCmd', '#f08c29'), color(`${command} [${args.length}]`), 'from', color(pushname), hexColor('Private chat', '#34ebc6'))
            if(isGroup) console.log(color('[CMD]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YYYY HH:mm:ss'), 'yellow'), hexColor('StickerCmd', '#f08c29'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(groupName, 'blue'))
        }
    } 
    else{
        if(msg.key.fromMe){
            if(isCmd && !isGroup) console.log(color('[CMD]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YYYY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', hexColor('fromMe', '#9ef542'), hexColor('Private chat', '#34ebc6'))
            if(isCmd && isGroup) console.log(color('[CMD]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YYYY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', hexColor('fromMe', '#9ef542'), 'in', color(groupName, 'blue'))
        }
        else{
            if(isCmd && !isGroup) console.log(color('[CMD]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YYYY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), hexColor('Private chat', '#34ebc6'))
            if(isCmd && isGroup) console.log(color('[CMD]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YYYY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(groupName, 'blue'))
        }
    }

    
    /** Response Handler **/
    //listResponse
    if (userListResponse == 'Love you') {
        client.sendMessage(from, 'Love you too :)', text, {quoted : msg})
    } else if (userListResponse == 'Fuck you') {
        client.sendMessage(from, 'Fuck you too -_', text, {quoted : msg})
    }

    //button response
    if(userButtonResponse == 'menu bot'){
        let pic = mediaUrl.karma_akabane_mini_wm
        let pp = await getBuffer(pic)
        const gambar = await client.prepareMessage(from, pp, image, {thumbnail: pp})
        const content = {
            imageMessage: gambar.message.imageMessage,
            contentText: menu(pushname, dataBot.prefix === 'multi' ? '#' : dataBot.prefix, dataBot.prefix === 'multi' ? 'MULTI-PREFIX' : dataBot.prefix, sender, timeWita, isPublic),
            footerText: `Creator Bot Whatsapp\n© ${botName}`,
            buttons: [
                {buttonId: 's&k', buttonText: {displayText: 'S&K'}, type: 1},
                {buttonId: 'speed', buttonText: {displayText: 'speed run'}, type: 1}
            ],
            headerType: 4
        }
        client.sendMessage(from, content, buttonsMessage, {
            quoted : fLiveLoc(2, "Menu Bot")
        })
    }
    else if (userButtonResponse == 'S&K') {
        fReply(
`🔥「 RULES BOT 」🔥

𒆜 Jangan spam bot. 
Sanksi: *SOFT BLOCK*

𒆜 Jangan telepon bot.
Sanksi: *SOFT BLOCK*

𒆜 Jangan mengejek bot.
Sanksi: *PERMANENT BLOCK*

𒆜 Beri jeda disetiap command.
Sanksi: *YNTKTS*

Jika sudah dipahami rules-nya, Silakan dipatuhi✔️

Owner BOT:
*YNTKTS*`)

    }
    else if (userButtonResponse == 'speed run') {
        const timestamp = speed();
        const latensi = speed() - timestamp 
        p0 =`Speed :\n${latensi.toFixed(4)} Second`
        fReply(p0)
    }
    else if (userButtonResponse == 'donasi') {
        const nomor = '085829271476'
        const teks = 
`*「 Donasi Agar Bot Tetap Online 」*

*╭─❒ Donate*
*│*
*│* Saweria: https://saweria.co/edwindefine
*│* Trakteer: https://trakteer.id/edwindefine
*│* Pulsa: ${nomor}
*│* Dana: ${nomor}
*│* Ovo: ${nomor}
*│* Gopay: ${nomor}
*│*
*╘═══ 《 *By ${ownerName}* 》 ═══*

Harga Kuota Mahal bos :)
`
        client.sendMessage(from, teks, text, {
            quoted: fDoc(2, 'Donate'),
            contextInfo: fakeUrl('Donasi Untuk Bot', mediaUrl.donate, 'https://saweria.co/edwindefine', sender)
        })
    }
    else if (userButtonResponse == 'contact creator') {
        // client.sendMessage(from, {displayName: 'Edwin', vcard: vCard}, contact, {quoted: msg})
        let listKontak = []
        for (let i of ownerNumber) {
            const vname = client.contacts[i] != undefined ? client.contacts[i].vname || client.contacts[i].notify : undefined
            listKontak.push({
                displayName: 'Edwin',
                vcard: 'BEGIN:VCARD\n'
                + 'VERSION:3.0\n' 
                + 'N:Sy;Bot;;;\n'
                + `FN:${vname ? `${vname}` : `${client.user.name}`}\n`
                + 'ORG:NASA CORPORATION✓;\n'
                + `item1.TEL;type=CELL;type=VOICE;waid=${i.split('@')[0]}:${i.split('@')[0]}\n`
                // + 'item1.X-ABLabel:Ponsel\n'
                + 'END:VCARD'
            })
        }
        let kontak = await client.sendMessage(from, {displayName: `${listKontak.length} kontak`, contacts: listKontak}, contactsArray, { quoted: fTroli(2, 'creator✔') })
        client.sendMessage(from,`Nih kontak Owner ku!`, text, {quoted: kontak})
    }

    
    switch(command){
/******** Main Command ********/
        case 'testo':{//for test
            client.sendMessage(from, {
                degreesLatitude: 0,
                degreesLongitude: 0,
                name: 'South Brisbane',
                address: 'Cloudflare, Inc',
                jpegThumbnail: imagePreview,
            }, liveLocation, {
                contextInfo:{}
            })
            // client.sendMessage(from, fs.readFileSync('./assets/media/nagapixel smp.jpg'), image, {
            //     thumbnail: fs.readFileSync('./assets/media/karma_akabane_wm.jpg'),
            //     caption: 'makan nih testo ajg!'
            // })
        }
            break
        case 'menu':
        case 'tes':
        case 'help':{
            const buttons = [
                {buttonId: 'donasi', buttonText: {displayText: 'donasi'}, type: 1},
                {buttonId: 'owner', buttonText: {displayText: 'contact creator'}, type: 1},
                {buttonId: 'menu', buttonText: {displayText: 'menu bot'}, type: 1}
            ]
            // let pic = ''
            // try { pic = await client.getProfilePicture(sender) } 
            // catch { pic = mediaUrl.no_profile }
            let pic = mediaUrl.karma_akabane_mini_wm
            let pp = await getBuffer(pic)
            const gambar = await client.prepareMessage(from, pp, image, { thumbnail: pp })
            const content = {
                imageMessage: gambar.message.imageMessage,
                contentText: `Active!\n\nNote: Jika button tidak terlihat bisa tulis *${userPrefix}menubot* untuk melihat semua menu`,
                footerText: `Creator Bot Whatsapp\n© ${botName}`,
                buttons: buttons,
                headerType: 4
            }
            await client.sendMessage(from, content, buttonsMessage, {
                quoted: fKontak(0, pushname),
                contextInfo: fakeUrl('Shut Up Your Mouth', mediaUrl.karma_akabane_mini_wm, '', sender),
            })
        }
            break
        case 'menubot':{
            let pic = mediaUrl.karma_akabane_mini_wm
            let pp = await getBuffer(pic)
            const gambar = await client.prepareMessage(from, pp, image, {thumbnail: pp})
            const content = {
                imageMessage: gambar.message.imageMessage,
                contentText: menu(pushname, dataBot.prefix === 'multi' ? '#' : dataBot.prefix, dataBot.prefix === 'multi' ? 'MULTI-PREFIX' : dataBot.prefix, sender, timeWita, isPublic),
                footerText: `Creator Bot Whatsapp\n© ${botName}`,
                buttons: [
                    {buttonId: 's&k', buttonText: {displayText: 'S&K'}, type: 1},
                    {buttonId: 'speed', buttonText: {displayText: 'speed run'}, type: 1}
                ],
                headerType: 4
            }
            client.sendMessage(from, content, buttonsMessage, {
                quoted : fLiveLoc(2, "Menu Bot")
            })
        }
            break
        case 'lmp':{//listmessage processed
            poy = client.prepareMessageFromContent(from, {
                "listMessage":{
                    "title": "HELLO :)",
                    "description": `Whats'up Brother, I am Edw!`,
                    "buttonText": "I Am Here!",
                    "listType": "SINGLE_SELECT",
                    "sections": [
                        {
                            "title": "Halo Mastah",
                            "rows": [
                                {
                                    "title": "Love you",
                                    "rowId": `Love you`
                                },
                                {
                                    "title": "Halo Mastah",
                                    "title": "Fuck you",
                                    "rowId": `Fuck you`
                                }
                            ]
                        }
                    ]
                }
            }, {}) 
            client.relayWAMessage(poy, {waitForAck: true})
        }
            break
        
       


/******** Owner ********/
        case 'broadcast':
        case 'bc':{
            client.updatePresence(from, Presence.composing)
            if (!isOwner) return 
            if (!q) return reply('Teksnya?')
            let allChats = await client.chats.all()
            if (isMedia && !msg.message.videoMessage || isQuotedImage) {
                const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                let buff = await client.downloadMediaMessage(encmedia)
                for (let chat of allChats) {
                    client.sendMessage(chat.jid, buff, image, {
                        quoted: fTroli(2, 'Broadcast'), 
                        contextInfo: { forwardingScore: 508, isForwarded: true}, 
                        caption: `*《BROADCAST BOT》*\n\n${q}`
                    })
                }
                reply(`Sukses mengirim Broadcast :\n\n${q}`)
            } else if (isMedia && !msg.message.imageMessage && !msg.message.videoMessage.gifPlayback || isQuotedVideo && !msg.message.extendedTextMessage.contextInfo.videoMessage.gifPlayback) {
                const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                let buff = await client.downloadMediaMessage(encmedia)
                for (let chat of allChats) {
                    client.sendMessage(chat.jid, buff, video, { 
                        quoted: fTroli(2, 'Broadcast'), 
                        contextInfo: { forwardingScore: 508, isForwarded: true}, 
                        caption: `*《BROADCAST BOT》*\n\n${q}`
                    })
                }
                reply(`Sukses mengirim Broadcast :\n\n${q}`)
            } else if (isMedia && !msg.message.imageMessage || isQuotedVideo) {
                const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                let buff = await client.downloadMediaMessage(encmedia)
                for (let chat of allChats) {
                    client.sendMessage(chat.jid, buff, video, { 
                        mimetype: Mimetype.gif, 
                        quoted: fTroli(2, 'Broadcast'),
                        contextInfo: { forwardingScore: 508, isForwarded: true}, 
                        caption: `*《BROADCAST BOT》*\n\n${q}` 
                    })
                }
                reply(`Sukses mengirim Broadcast :\n\n${q}`)
            } else {
                for (let chat of allChats) {
                    client.sendMessage(chat.jid, `*《BROADCAST BOT》*\n\n${q}`, text, {
                        quoted: fTroli(2, 'Broadcast'),
                        contextInfo: { forwardingScore: 508, isForwarded: true}
                    })
                }
                reply(`Sukses mengirim Broadcast :\n\n${q}`)
            }
        }
            break

        case 'public':{
            if(!isOwner) return
            if(isPublic === true) return
            dataBot.isPublic = true
            fs.writeFileSync('./database/data_bot.json', JSON.stringify(dataBot))
            dataBot = JSON.parse(fs.readFileSync('./database/data_bot.json'))//membaca ulang json file
            fReply(`「 *PUBLIC-MODE* 」`)
        }
            break
        case 'self':{
            if(!isOwner) return
            if(isPublic === false) return
            dataBot.isPublic = false
            fs.writeFileSync('./database/data_bot.json', JSON.stringify(dataBot))
            dataBot = JSON.parse(fs.readFileSync('./database/data_bot.json'))
            fReply(`「 *SELF-MODE* 」`)
        }
            break
        case 'setexif':{
            if (!isOwner) return
            if (!q) return reply(`Kirim perintah *${userPrefix}setExif [teks]*\ncontoh:\n\n${userPrefix}setExif sticker|edwin`)
            const data = q.split('|')
            const satu = data[0]
            const dua = data[1] ? data[1] : ''
            await createExif(satu, dua, 'sticker')
            fReply('Berhasil Set Exif Sticker✔️')
            cmdSuccess('setexif processed')
        }
            break
        case 'setimgpreview':
        case 'setimgprev':{
            if (!isOwner) return
            if (!msg.message.imageMessage && !isQuotedImage) return reply('Reply sebuah image!')
            const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM','m')).message.extendedTextMessage.contextInfo : msg
            const media = await client.downloadAndSaveMediaMessage(encmedia, `./assets/media/imgPrev`)
            dataBot.imgprev = media
            fs.writeFileSync('./database/data_bot.json', JSON.stringify(dataBot))
            dataBot = JSON.parse(fs.readFileSync('./database/data_bot.json'))
            fReply('Berhasil mengganti imagepreview✔️')
            cmdSuccess('setimgpreview processed')
        }
            break
        case 'removebanchat':
        case 'removebc':{
            if(!isOwner) return
            if(!q) return reply("Id groupnya?")
            if(!banchat.includes(q)) return reply('Id group tersebut tidak ada dalam daftar banchat!')
            let index = banchat.indexOf(q)
            banchat.splice(index, 1)
            fs.writeFileSync('./database/banchat.json', JSON.stringify(banchat))
            banchat = JSON.parse(fs.readFileSync('./database/banchat.json'))
            fReply(`Berhasil menghapus banchat dari group *${q}*`)
        } 
            break
        case 'antidel':{
            if(!isOwner) return
            if(!q) return reply('pilih aktif/nonaktif')
            let antidel = dataBot.antidel
            if(q.toLowerCase() === 'aktif' || q.toLowerCase() === 'true') {
                if(antidel === true) return reply('sudah aktif!')
                dataBot.antidel = true
                fs.writeFileSync('./database/data_bot.json', JSON.stringify(dataBot))
                dataBot = JSON.parse(fs.readFileSync('./database/data_bot.json'))
                fReply(`「 *ANTIDEL AKTIF* 」`)
            } else if(q.toLowerCase() === 'nonaktif' || q.toLowerCase() === 'false'){
                if(antidel === false) return reply('belum aktif!')
                dataBot.antidel = false
                fs.writeFileSync('./database/data_bot.json', JSON.stringify(dataBot))
                dataBot = JSON.parse(fs.readFileSync('./database/data_bot.json'))
                fReply(`「 *ANTIDEL NONAKTIF* 」`)
            } else{
                reply('pilih *aktif/nonaktif* saja brother')
            }
        }
            break
        case 'autoresponse':{
            if(!isOwner) return
            if(!q) return reply('pilih aktif/nonaktif')
            let autoResponse = dataBot.autoResponse
            if(q.toLowerCase() === 'aktif' || q.toLowerCase() === 'true') {
                if(autoResponse === true) return reply('sudah aktif!')
                dataBot.autoResponse = true
                fs.writeFileSync('./database/data_bot.json', JSON.stringify(dataBot))
                dataBot = JSON.parse(fs.readFileSync('./database/data_bot.json'))
                fReply(`「 *AUTORESPONSE AKTIF* 」`)
            } else if(q.toLowerCase() === 'nonaktif' || q.toLowerCase() === 'false'){
                if(autoResponse === false) return reply('belum aktif!')
                dataBot.autoResponse = false
                fs.writeFileSync('./database/data_bot.json', JSON.stringify(dataBot))
                dataBot = JSON.parse(fs.readFileSync('./database/data_bot.json'))
                fReply(`「 *AUTORESPONSE NONAKTIF* 」`)
            } else{
                reply('pilih *aktif/nonaktif* saja brother')
            }
        }
            break
        case 'addcmd':{
            if(!isOwner) return
            if(!isQuotedSticker) return reply('reply stickernya om!')
            if(!q) return reply('Masukan value command untuk sticker!')
            for(let i = 0; i<stickerCommand.length; i++){
                if(msg.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage.fileSha256.toString() == stickerCommand[i].key){
                    return reply('Sticker tersebut telah terisi command!')
                }
            }
            const buffer = msg.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage.fileSha256.toString()
            const command = q
            stickerCommand.push({key:buffer,value:command})
            fs.writeFileSync('./sticker/command.json', JSON.stringify(stickerCommand), (err) => { if(err) throw err })
            stickerCommand = JSON.parse(fs.readFileSync('./sticker/command.json'))
            fReply('Sticker Command Ditambahkan✔️')
        }
            break
        case 'removecmd':{
            if(!isOwner) return
            if(!q) return reply('Masukan command sticker yang mau dihapus!')
            for(let i = 0; i<stickerCommand.length; i++){
                if(q.toLowerCase() == stickerCommand[i].value.toLowerCase()){
                    let i2 = i===0?1:i
                    stickerCommand.splice(i, i2)
                    fs.writeFileSync('./sticker/command.json', JSON.stringify(stickerCommand), (err) => { if(err) throw err })
                    stickerCommand = JSON.parse(fs.readFileSync('./sticker/command.json'))
                    return fReply('Berhasil menghapus command✔️')
                }
            }
            reply('❌Tidak bisa menemukan command sticker tersebut')
        }
            break
        case 'listcmd':{
            let listCmd = ''
            stickerCommand.forEach((item, index) => {
                listCmd += '❒ '+item.value+'\n'; 
            });
            reply(`List Sticker Command : \n\n${listCmd}\n*Total : ${stickerCommand.length}*`)
        }
            break
        case 'addresponse':{
            if (!isOwner) return
            if (!q) return reply(`Masukan key dan responsenya\n\nContoh : ${userPrefix}addrespon *hai|halo*`)
            if (!q.includes('|')) return reply(`Masukan key dan responsenya\n\nContoh : ${userPrefix}addrespon *hai|halo*`)
            let input = q.split("|")
            if (checkResponse(input[0], responseDb) === true) return reply(`Response tersebut sudah ada`)
            addResponse(input[0], input[1], sender, responseDb) 
            fReply(`Key : ${input[0]}\nRespon : ${input[1]}\n\nRespon berhasil di set✔️`)
        }
            break
        case 'delresponse':{
            if (!isOwner) return
            if (!q) return reply(`Masukan keynya\n\nContoh : ${userPrefix}delrespon *hai*`)
            if (!checkResponse(q, responseDb)) return reply(`Key tersebut tidak ada di database`)
            deleteResponse(q, responseDb)
            fReply(`Berhasil menghapus respon dengan key ${q}✔️`)
        }
            break
        case 'listresponse':{
            if(!isOwner) return
            let txt = ``
            for (let i = 0; i < responseDb.length; i++){
                txt += `❏ Key : ${responseDb[i].pesan}\n`
            }
            reply(`List Auto Response Bot : \n\n${txt}\n*Total : ${responseDb.length}*`)
        }
            break
        case 'savemusic':
        case 'savevn':{
            if(!isOwner) return
            if(!q) return reply('Masukan nama untuk vn/music nya!')
            if(!msg.message.audioMessage && !isQuotedAudio) return reply('Cuma bisa simpan audio!')
            const encmedia = isQuotedAudio ? JSON.parse(JSON.stringify(msg).replace('quotedM','m')).message.extendedTextMessage.contextInfo : msg
            await client.downloadAndSaveMediaMessage(encmedia, `./assets/saveaudio/${q}`)
            fReply('Vn/Music Disimpan✔️')
        }
            break
        case 'savemedia':{
            if(!isOwner) return
            if(!q) return reply('nama media nya?')
            // const existFile = fs.readdirSync('./assets/savemedia')
            // if(existFile.includes(q)) q = q+`${Math.floor(Math.random()*10000)}`
            if(!isMedia && !isQuotedImage && !isQuotedVideo) return reply('Cuma bisa simpan image/video!')
            const encmedia = isQuotedImage || isQuotedVideo ? JSON.parse(JSON.stringify(msg).replace('quotedM','m')).message.extendedTextMessage.contextInfo : msg
            await client.downloadAndSaveMediaMessage(encmedia, `./assets/savemedia/${q}`)
            fReply('Selesai Menyimpan Media✔️')
        }
            break
        case 'getid':{
            if(!isOwner) return
            await client.sendMessage(botNumber, groupName ? `*${groupName}*\n\nId:\n${from}` : `*${pushname}*\n\nId:\n${from}`, text)
            cmdSuccess('Group id obtained')
        }
            break
        case 'imgbb':
            if(!isOwner) return
            reply(mess.wait)
            const encmedia  = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM','m')).message.extendedTextMessage.contextInfo : msg
            const media = await client.downloadAndSaveMediaMessage(encmedia)
            imgbb('69c7d14a0633cbc3bee6c3085fcaf388', media)
                .then(data => {
                    let content = `
╭─「 IMGBB UPLOADER 」
│
├• ID : ${data.id}
├• MimeType : ${data.image.mime}
├• Extension : ${data.image.extension}
│
├• URL : ${data.display_url}
╰─────────────────────`
                    ibb = fs.readFileSync(media)
                    client.sendMessage(from, ibb, image, { quoted: fMsg(0, 'imgbb'), caption: content })
                })
                .catch(err => {
                    throw err 
                })
            break
        case 'buggc':{
            if(!isOwner) return
            client.toggleDisappearingMessages(from)
            fReply('Hehey Not Bad')
        }
            break

/******** Group ********/
        case 'antilink':{
            if (!isGroup) return reply(mess.only.group)
            if(!isGroupAdmins && !isOwner) return reply(mess.only.admin)
            if (!q) return reply(`untuk menggunakan command ini ketik :\n${userPrefix}antilink aktif/nonaktif`)
            if (q.toLowerCase() === 'aktif') {
                if (isAntiLink) return reply('Sudah Aktif Kak!')
                antiLink.push(from)
                fs.writeFileSync('./database/antilink.json', JSON.stringify(antiLink))
                fReply('Success *Mengaktifkan* ANTILINK digroup ini!✔️')
            } else if (q.toLowerCase() === 'nonaktif') {
                if (!isAntiLink) return reply('Sudah Mati Kak!')
                let groupId = antiLink.indexOf(from)
                antiLink.splice(groupId, 1)
                fs.writeFileSync('./database/antilink.json', JSON.stringify(antiLink))
                fReply('Success *Mematikan* ANTILINK digroup ini!✔️')
            } else {
                reply('*aktif* untuk mengaktifkan, *nonaktif* untuk mematikan')
            }
        }
            break
        case 'antivirtex':{
            if (!isGroup) return reply(mess.only.group)
            if(!isGroupAdmins && !isOwner) return reply(mess.only.admin)
            if (!q) return reply(`untuk menggunakan command ini ketik :\n${userPrefix}antilink aktif/nonaktif`)
            if (q.toLowerCase() === 'aktif') {
            if (isAntiVirtex) return reply('Sudah Aktif')
                antiVirtex.push(from)
                fs.writeFileSync('./database/antivirtex.json', JSON.stringify(antiVirtex))
                fReply('Success *Mengaktifkan* ANTIVIRTEX digroup ini!✔️')
            } else if (q.toLowerCase() === 'nonaktif') {
                if (!AntiVirtex) return reply('Sudah Mati')
                let groupId = antiVirtex.indexOf(from)
                antiVirtex.splice(groupId, 1)
                fs.writeFileSync('./database/antivirtex.json', JSON.stringify(antiVirtex))
                fReply('Success *Mematikan* ANTIVIRTEX digroup ini!✔️')
            } else {
                reply('*aktif* untuk mengaktifkan, *nonaktif* untuk mematikan')
            }
        }
            break
        case 'add':{
            if (!isGroup) return reply(mess.only.group)
            if (!isGroupAdmins) return reply(mess.only.admin)
            if (!isBotGroupAdmins) return reply(mess.only.adminbot)
            if (!q) return reply(`Nomor yang mau di add?`)
            try {
                let nomor = `${convertNumber(q)}@s.whatsapp.net`
                await client.groupAdd(from, [nomor])
            } catch (e) {
                console.log('Error :', e)
                reply('Gagal menambahkan nomor, mungkin karena di private')
            }
        }
            break
        case 'kick':{
            if (!isGroup) return reply(mess.only.group)
            if (!isGroupAdmins) return reply(mess.only.admin)
            if (!isBotGroupAdmins) return reply(mess.only.adminbot)
            if (msg.message.extendedTextMessage === null || msg.message.extendedTextMessage === undefined) return reply('Mention member yang mau dikick!');
            if (!msg.message.extendedTextMessage.contextInfo.participant) {
                const target = msg.message.extendedTextMessage.contextInfo.mentionedJid
                if (target.length > 1) {
                    let memberId = []
                    for (let id of target) {
                        memberId.push(id)
                    }
                    client.groupRemove(from, memberId)
                } else {
                    client.groupRemove(from, [target[0]])
                }
            } else {
                const target = msg.message.extendedTextMessage.contextInfo.participant
                client.groupRemove(from, [target])
            }
            const content = `Sukses melakukan kick✔️`
            reply(content)
        }
            break
        case 'promote':{
            if (!isGroup) return reply(mess.only.group)
            if (!isGroupAdmins) return reply(mess.only.admin)
            if (!isBotGroupAdmins) return reply(mess.only.adminbot)
            if (msg.message.extendedTextMessage === null || msg.message.extendedTextMessage === undefined) return reply('Mention member yang mau promote!');
            if (!msg.message.extendedTextMessage.contextInfo.participant) {
                const target = msg.message.extendedTextMessage.contextInfo.mentionedJid
                if (target.length > 1) {
                    let memberId = []
                    for (let id of target) {
                        memberId.push(id)
                    }
                    client.groupMakeAdmin(from, memberId)
                } else client.groupMakeAdmin(from, [target[0]])
            } else {
                const target = msg.message.extendedTextMessage.contextInfo.participant
                client.groupMakeAdmin(from, [target])
            }
            const content = `Sukses melakukan promote✔️`
            reply(content)
        }
            break
        case 'demote':{
            if (!isGroup) return reply(mess.only.group)
            if (!isGroupAdmins) return reply(mess.only.admin)
            if (!isBotGroupAdmins) return reply(mess.only.adminbot)
            if (msg.message.extendedTextMessage === null || msg.message.extendedTextMessage === undefined) return reply('Mention member yang mau demote!');
            if (!msg.message.extendedTextMessage.contextInfo.participant) {
                const target = msg.message.extendedTextMessage.contextInfo.mentionedJid
                if (target.length > 1) {
                    let memberId = []
                    for (let id of target) {
                        memberId.push(id)
                    }
                    client.groupDemoteAdmin(from, memberId)
                } else client.groupDemoteAdmin(from, [target[0]])
            } else {
                const target = msg.message.extendedTextMessage.contextInfo.participant
                client.groupDemoteAdmin(from, [target])
            }
            const content = `Sukses melakukan demote✔️`
            reply(content)
        }
            break
        case 'banchat':{
            if (!isGroup) return reply(mess.only.group)
            if (!isOwner && !isGroupAdmins)return reply(mess.only.admin)
            if (!q) return reply('pilih aktif/nonaktif')
            if(q.toLowerCase() === 'aktif' || q.toLowerCase() === 'true') {
                if(isBanchat) return reply('sudah aktif!')
                banchat.push(from)
                fs.writeFileSync('./database/banchat.json', JSON.stringify(banchat))
                banchat = JSON.parse(fs.readFileSync('./database/banchat.json'))
                fReply(`*BANCHAT AKTIF DI GROUP INI*`)
            } else if(q.toLowerCase() === 'nonaktif' || q.toLowerCase() === 'false'){
                if(!isBanchat) return reply('belum aktif!')
                let index = banchat.indexOf(from)
                banchat.splice(index, 1)
                fs.writeFileSync('./database/banchat.json', JSON.stringify(banchat))
                banchat = JSON.parse(fs.readFileSync('./database/banchat.json'))
                fReply(`*BANCHAT NONAKTIF DI GROUP INI*`)
            } else{
                reply('pilih *aktif/nonaktif* saja brother')
            }
        }
            break
        case 'listbanchat': 
        case 'listbc':{
            let listBc = ''
            banchat.forEach((item, index) => {
                listBc += '❒ '+item+'\n'; 
            });
            reply(`List Banchat : \n\n${listBc}\n*Total : ${banchat.length}*`)
        }
            break   
        case 'linkgc':
        case 'linkgrup':
        case 'linkgroup':{
            if (!isGroup) return reply(mess.only.group)
            if (!isBotGroupAdmins) return reply(mess.only.adminbot)
            const linkGc = await client.groupInviteCode(from)
            const content = `\`\`\`「 Link Group 」\`\`\`\n\n•> Group *${groupName}* :\nhttps://chat.whatsapp.com/${linkGc}\n\nRamein ya...`
            fReply(content)
        }
            break
        case 'join':{
            if (!q) return reply('Link groupnya?')
            try {
                if (!isUrl(q) && !q.includes('whatsapp.com')) return reply(mess.err.link)
                let inviteCode = q.split('https://chat.whatsapp.com/')[1]
                if (!inviteCode) return reply('Pastikan link sudah benar!')
                let response = await client.acceptInvite(inviteCode)
                fReply('Sukses masuk group✔️')
            } catch {
                reply(mess.err.link)
            }
        }
            break
        case 'hidetag':{
            if (!isGroup) return reply(mess.only.group)
            if (!isGroupAdmins && !isOwner) return reply(mess.only.admin)
            !q ? client.sendMessage(from, 'Hallo', extendedText, {contextInfo: {"mentionedJid": groupMembersId}}) : client.sendMessage(from, q, extendedText, {contextInfo: {"mentionedJid": groupMembersId}})
        }
            break
        case 'stag':{
            if (!isGroup) return reply(mess.only.group)
            if (!isGroupAdmins && !isOwner) return reply(mess.only.admin)
            const sName = './sticker/sTag.webp'
            client.sendMessage(from, fs.readFileSync(sName), sticker, {contextInfo: {"mentionedJid": groupMembersId}})
        }
            break
        case 'grouppic':
        case 'gcpic':{
            if(!isGroup) return reply(mess.only.group)
            let groupPic = ''
            try { groupPic = await client.getProfilePicture(from) } 
            catch { groupPic = mediaUrl.no_profile_group }
            let groupPp = await getBuffer(groupPic)
            await client.sendMessage(from, groupPp, image, {quoted : msg})
        }
            break
        case 'gpic':{
            if (msg.message.extendedTextMessage === null || msg.message.extendedTextMessage === undefined) return reply('Mention member yang mau diambil PPnya!');
            let target = ''
            if (!msg.message.extendedTextMessage.contextInfo.participant) target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0]
            else target = msg.message.extendedTextMessage.contextInfo.participant
            let pic = '';
            try{ pic = await client.getProfilePicture(target) }
            catch{ pic = mediaUrl.no_profile }
            let pp = await getBuffer(pic)
            await client.sendMessage(from, pp, image, {quoted : msg})
        }
            break


/********* Fake Test *********/
        case 'freply':{
            if(!q) reply('Mau fake reply yang mana?')
            const cmd = ['msg', 'vn', 'image', 'video', 'toko', 'troli', 'gif', 'location', 'livelocation', 'doc', 'kontak', 'invite', 'stk']
            const func = [fMsg, fVn, fImage, fVideo, fToko, fTroli, fGif, fLoc, fLiveLoc, fDoc, fKontak, fInvite, fSticker]
            
            for(let i = 0; i<cmd.length; i++){
                if(q.toLowerCase() === cmd[i]){
                    client.sendMessage(from, 'You Know?', extendedText, { quoted : func[i](0) })
                    return cmdSuccess('Freply processed')
                }
            }
            let listFreply = ''
            cmd.forEach((item, index) => {
                listFreply += index+1+'.'+item+'\n'; 
            });
            reply(`Yang tersedia cuma : \n\n${listFreply}\n*Total : ${cmd.length}*`)
        }
            break
        case 'listfreply':{
            const cmd = ['msg', 'vn', 'image', 'video', 'toko', 'troli', 'gif', 'location', 'livelocation', 'doc', 'kontak', 'invite', 'stk']
            let listFreply = ''
            cmd.forEach((item, index) => {
                listFreply += '❒ '+item+'\n'; 
            });
            reply(`List Freply Test : \n\n${listFreply}\n*Total : ${cmd.length}*`)
        }
            break
        case 'fakeurl':{
            client.sendMessage(from, `*Wake Up Brother*`, text, {
                contextInfo: fakeUrl('Shut Up Your Mouth', mediaUrl.karma_akabane_mini_wm, q ? q : '', sender), 
                quoted: msg})
            cmdSuccess('Fake Url processed')
        }
            break
        case 'fakeinvite':{
            client.sendMessage(from, {
                groupJid: "6285829271476-1621774709@g.us",
                inviteCode: 'eHk94nePYV38fjX+',
                inviteExpiration: 1,
                groupName: 'NagaPixel',
                jpegThumbnail: fs.readFileSync('./assets/media/karma_akabane_mini.jpg'),
                caption: 'Memaksa untuk bergabung ke Grup ini!'
            }, groupInviteMessage)//, {contextInfo : {'mentionedJid' : groupMembersId}}
            cmdSuccess('invite group processed')
        }
            break
        case 'fakelocation':{
            client.sendMessage(from, {degreesLatitude: -6.200000, degreesLongitude: 106.816666}, liveLocation)
            cmdSuccess('fake Location Processed')
        }
            break
        case 'fakeproduct':{
            // cmdSuccess('fake Product Processed')
        }
            break

/******** Sticker ********/
        case 'stk':
        case 'stiker':
        case 'sticker':
        case 'stickers':
        case 's':{
            return
            if (type !== 'videoMessage' && type !== 'imageMessage' && !isQuotedImage && !isQuotedVideo) return reply(`Kirim media gambar/video/gif dengan caption ${userPrefix}sticker`)
            if ((type === 'videoMessage' && msg.message.videoMessage.seconds > 7 || isQuotedVideo && msg.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds > 7)) return reply('max durasi video 7 detik!')
            const encmedia = isQuotedVideo || isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM','m')).message.extendedTextMessage.contextInfo : msg
            const media = await client.downloadAndSaveMediaMessage(encmedia, `./sticker/stk`) 
            execSticker('./sticker/sticker.exif', media)
                .then((sName) => {
                    if(sName !== false){
                        const buffer = fs.readFileSync(sName)
                        client.sendMessage(from, buffer, sticker, {quoted:msg})
                        cmdSuccess('Sticker Processed')
                        fs.unlinkSync(media)
                        fs.unlinkSync(sName)
                    } else reply('sticker error')
                })
        }
            break
        case 'swm':{
            return
            if(type !== 'videoMessage' && type !== 'imageMessage' && !isQuotedImage && !isQuotedVideo) return reply(`Kirim media gambar/video/gif dengan caption ${userPrefix}sticker`)
            if ((type === 'videoMessage' && msg.message.videoMessage.seconds > 10 || isQuotedVideo && msg.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds > 10)) return reply('max durasi video 10 detik!')
            const encmedia = isQuotedVideo || isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM','m')).message.extendedTextMessage.contextInfo : msg
            const media = await client.downloadAndSaveMediaMessage(encmedia, './sticker/stk')
            const data = q.split('|')
            const satu = data[0] !== '' ? data[0] : ownerName
            const dua = typeof data[1] !== 'undefined' ? data[1] : ``
            const exif = await createExif(satu, dua)
            execSticker(exif, media)
                .then((sName) => {
                    if(sName !== false){
                        const buffer = fs.readFileSync(sName)
                        client.sendMessage(from, buffer, sticker, {quoted:msg})
                        cmdSuccess('Sticker Watermark Processed')
                        fs.unlinkSync(media)
                        fs.unlinkSync(sName)
                    } else reply('sticker error')
                })
        }
            break
        case 'take':{
            return
            if (!isQuotedSticker) return reply('reply stickernya om!')
            const encmedia = JSON.parse(JSON.stringify(msg).replace('quotedM','m')).message.extendedTextMessage.contextInfo
            const media = await client.downloadAndSaveMediaMessage(encmedia, './sticker/stk')
            const data = q.split('|')
            const satu = data[0] !== '' ? data[0] : ownerName
            const dua = typeof data[1] !== 'undefined' ? data[1] : ``
            const exif = await createExif(satu, dua)
            execWebp(exif, media)
                .then((sName) => {
                    if(sName !== false){
                        const buffer = fs.readFileSync(sName)
                        client.sendMessage(from, buffer, sticker)
                        cmdSuccess('Take sticker Processed')
                        fs.unlinkSync(media)
                        fs.unlinkSync(sName)
                    } else reply('sticker error')
                })
        }
            break
        case 'attp':{
            return
            if (!q) return reply(`Kirim perintah *${userPrefix}attp* teks`)
            // let attp = await getBuffer(`https://api.xteam.xyz/attp?file&text=${encodeURIComponent(q)}`)
            let attp = await getBuffer(`https://hardianto-chan.herokuapp.com/api/maker/attp?text=${q}&apikey=hardianto`)
            fs.writeFileSync('./sticker/attp.webp', attp)
            const media = './sticker/attp.webp'
            const pack = 'yntkts'
            const author = ''
            const exif = await createExif(pack, author)
            execWebp(exif, media)
                .then((sName) => {
                    if(sName !== false){
                        const buffer = fs.readFileSync(sName)
                        client.sendMessage(from, buffer, sticker)
                        cmdSuccess('Attp Processed')
                        fs.unlinkSync(media)
                        fs.unlinkSync(sName)
                    } else reply('sticker error')
                })
        }
            break

/********* Anime *********/ 
        case 'wallanime':{
            let res = await got.get(`https://nekos.life/api/v2/img/wallpaper`)
            res = JSON.parse(res.body)
            const wallAnime = await getBuffer(res.url)
            await client.sendMessage(from, wallAnime, image, {
                quoted: msg,
            })
            cmdSuccess(`Sending WallAnime`)
        }
            break   
        case 'chara':{
            if(!q) return reply(`Mau gambar apa?\ncontoh\n\n${prefix}chara nino`)
            let chara = await hx.chara(q)
            let random = chara[Math.floor(Math.random() * chara.length)]
            let img = await getBuffer(random)
            await client.sendMessage(from, img, image,{quoted: msg})
        }
            break

/********* Query Loacal Media *********/
        case 'sendmedia':{
            if(!q) reply('Mau media yang mana?')
            const saveMedia = fs.readdirSync('./assets/savemedia')
            for(let i = 0; i<saveMedia.length; i++){
                if(q.toLowerCase() === saveMedia[i].toLowerCase()){
                    let tipe = saveMedia[i].split(".")[1] === 'jpg' || saveMedia[i].split(".")[1] === 'jpeg' || saveMedia[i].split(".")[1] === 'png' ? 'image' : 'video'
                    if(tipe === 'image') client.sendMessage(from, { url: `assets/savemedia/${saveMedia[i]}` }, image, {quoted: msg})
                    else client.sendMessage(from, { url: `assets/savemedia/${saveMedia[i]}` }, video, {quoted: msg})
                    return cmdSuccess('sendmedia processed')
                }
            }
        }
            break
        case 'listmedia':{
            const saveMedia = fs.readdirSync('./assets/savemedia')
            let listMedia = ''
            saveMedia.forEach((item, index) => {
                listMedia += '❒ '+item+'\n'; 
            });
            reply(`List Save Media : \n\n${listMedia}\n*Total : ${saveMedia.length}*`)
        }
            break
        case 'sendmusic':{
            if(!q) reply('Mau music yang mana?')
            const saveAudio = fs.readdirSync('./assets/saveaudio')
            for(let i = 0; i<saveAudio.length; i++){
                if(q.toLowerCase() === saveAudio[i].split(".")[0].toLowerCase()){
                    client.sendMessage(from, { url: `assets/saveaudio/${saveAudio[i]}` }, audio, { mimetype: Mimetype.mp4Audio, ptt : false })
                    return cmdSuccess('sendmusic processed')
                }
            }
            let listMusic = ''
            saveAudio.forEach((item, index) => {
                listMusic += '❒ '+item.split('.')[0]+'\n'; 
            });
            reply(`Yang tersedia cuma : \n\n${listMusic}\n*Total : ${saveAudio.length}*`)
        }
            break
        case 'sendvn':{
            if(!q) reply('Mau vn yang mana?')
            const saveAudio = fs.readdirSync('./assets/saveaudio')
            for(let i = 0; i<saveAudio.length; i++){
                if(q.toLowerCase() === saveAudio[i].split(".")[0].toLowerCase()){
                    client.sendMessage(from, { url: `assets/saveaudio/${saveAudio[i]}` }, audio, { mimetype: Mimetype.mp4Audio, ptt : true })
                    return cmdSuccess('sendVn processed')
                }
            }
            let listVn = ''
            saveAudio.forEach((item, index) => {
                listVn += '❒ '+item.split('.')[0]+'\n'; 
            });
            reply(`Yang tersedia cuma : \n\n${listVn}\n*Total : ${saveAudio.length}*`)
        }
            break
        case 'listmusic':
            case 'listvn':{
                const saveAudio = fs.readdirSync('./assets/saveaudio')
                let listVn = ''
                saveAudio.forEach((item, index) => {
                    listVn += '❒ '+item.split('.')[0]+'\n'; 
                });
                reply(`List Saved Vn/Music : \n\n${listVn}\n*Total : ${saveAudio.length}*`)
            }
                break


/********* Converter *********/
        case 'nulis':{
            if (!q) return reply(`Kirim perintah *${userPrefix}nulis [teks]*\ncontoh:\n\n${userPrefix}nulis aku anak pintar`)
            // let buffer = await getBuffer(`https://edwindefine.herokuapp.com/api/maker/nulis?apikey=${ApiKey}&text=${q}`)
            let url = await axios.get(`https://hardianto-chan.herokuapp.com/api/nuliskiri?text=${q}`)
            let buffer = url.data
            client.sendMessage(from, buffer, image, {
                caption: `*Berhasil Diproses✔️*`, 
                quoted: fToko(2, 'Nulis')
            })
            cmdSuccess('nulis processed')
        }
            break
        case 'tts':{
            if (!q) return reply(`Kirim perintah *${userPrefix}ptt [bahasa] [teks]*\ncontoh:\n\n${userPrefix}ptt id halo`)
            if (args.length < 2) return reply(`Kirim perintah *${userPrefix}ptt [bahasa] [teks]*\ncontoh:\n\n${userPrefix}ptt id halo`)
            const ttsId = gtts('id')
            const ttsEn = gtts('en')
            const ttsJp = gtts('ja')
            const ttsAr = gtts('ar')
            const dataText = body.slice(args[0].length+args[1].length+2);
            if (dataText.length > 300) return reply('Teks terlalu panjang!')
            let dataBhs = args[1].toLowerCase();
            if (dataBhs == 'id') {
                await ttsId.save('./assets/tts/resId.mp3', dataText, async function () {
                    await client.sendMessage(from, { url: `assets/tts/resId.mp3` }, audio, { quoted:msg, mimetype: Mimetype.mp4Audio, ptt : true })
                    cmdSuccess('tts processed')
                })
            } else if (dataBhs == 'en') {
                await ttsEn.save('./assets/tts/resEn.mp3', dataText, async function () {
                    await client.sendMessage(from, { url: `assets/tts/resEn.mp3` }, audio, { quoted:msg, mimetype: Mimetype.mp4Audio, ptt : true })
                    cmdSuccess('tts processed')
                })
            } else if (dataBhs == 'jp') {
                await ttsJp.save('./assets/tts/resJp.mp3', dataText, async function () {
                    await client.sendMessage(from, { url: `assets/tts/resJp.mp3` }, audio, { quoted:msg, mimetype: Mimetype.mp4Audio, ptt : true })
                    cmdSuccess('tts processed')
                })
            } else if (dataBhs == 'ar') {
                await ttsAr.save('./assets/tts/resAr.mp3', dataText, async function () {
                    await client.sendMessage(from, { url: `assets/tts/resAr.mp3` }, audio, { quoted:msg, mimetype: Mimetype.mp4Audio, ptt : true })
                    cmdSuccess('tts processed')
                })
            } else {
                reply('_Data bahasa anda salah atau tidak tersedia_\n\n*Data bahasa yang tersedia :*\n\n*id* untuk indonesia,\n*en* untuk inggris,\n*jp* untuk jepang,\n*ar* untuk arab')
            }
            
        }
            break
        case 'imgthumb':{
            if(type !== 'imageMessage' && !isQuotedImage) return reply('image nya?')
            const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM','m')).message.extendedTextMessage.contextInfo : msg                
            const media = await client.downloadAndSaveMediaMessage(encmedia, `./assets/toThumbImg`)
            await client.sendMessage(from, fs.readFileSync(media), image, {
                quoted:msg,
                thumbnail: imagePreview,
            })
            fs.unlinkSync(media)
            cmdSuccess(`imgThumb Processed`)
        }
            break
        case 'tomedia':{
            if (!isQuotedSticker) return reply('reply stickernya om!')
            const encmedia = JSON.parse(JSON.stringify(msg).replace('quotedM','m')).message.extendedTextMessage.contextInfo
            const media = await client.downloadAndSaveMediaMessage(encmedia, './sticker/toimg')
            if (msg.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage.isAnimated === true){
                webp2mp4File(media).then(res=>{
                    sendMediaURL(from, res.result, 'Done')
                    fs.unlinkSync(media)
                    cmdSuccess('tomp4 processed')
                })
            } else {
                const ext = media.endsWith('png') ? 'png' : 'jpg'
                let imgName = `./sticker/${getRandom(1000)}.${ext}`
                exec(`ffmpeg -i ${media} ${imgName}`, (err) => {
                    if (err) return reply(mess.err.fail)
                    fs.unlinkSync(media)
                    client.sendMessage(from, fs.readFileSync(imgName), image, {quoted: msg, caption: '.'})
                    fs.unlinkSync(imgName)
                })
                cmdSuccess('toimg processed')
            }
        }
            break
        case 'tomp3':{
            if (!msg.message.videoMessage && !isQuotedVideo) return reply('reply videonya om!')
            reply(mess.wait)
            const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
            const media = await client.downloadAndSaveMediaMessage(encmedia, './assets/tomp3')
            let theName = `assets/${getRandom(1000)}.mp3`
            exec(`ffmpeg -i ${media} ${theName}`, (err) => {
                if (err) return reply(mess.err.msg)
                fs.unlinkSync(media)
                let buffer = fs.readFileSync(theName)
                client.sendMessage(from, buffer, audio, { mimetype: 'audio/mp4', quoted: msg })
                fs.unlinkSync(theName)
            })
            cmdSuccess('tomp3 processed')
        }
            break

/********* Kerang Menu *********/
        case 'apakah':{
            if(!q) return reply(`Kirim perintah *${userPrefix}apakah teks*\ncontoh:\n\n${userPrefix}apakah saya ganteng?`)
            if(q.length > 500) return reply('Teks terlalu panjang!')
            client.sendMessage(from, `*Pertanyaan:* apakah ${q}\n*Jawaban:* ${pickRandom(['Ya', 'Mungkin iya', 'Mungkin', 'Mungkin tidak', 'Tidak', 'Tidak mungkin'])}`, text,{quoted: msg})
        }
            break
        case 'kapankah':{
            if(!q) return reply(`Kirim perintah *${userPrefix}kapankah teks*\ncontoh:\n\n${userPrefix}kapankah saya sukses?`)
            if(q.length > 500) return reply('Teks terlalu panjang!')
            client.sendMessage(from, `*Pertanyaan:* kapankah ${q}\n\n*Jawaban:* ${Math.floor(Math.random() * 10)} ${pickRandom(['detik', 'menit', 'jam', 'hari', 'minggu', 'bulan', 'tahun', 'dekade', 'abad'])} lagi...`, text,{quoted: msg})
        }
            break
        case 'rate':{
            if(!q) return reply(`Kirim perintah *${userPrefix}rate teks*\ncontoh:\n\n${userPrefix}rate kegantengan saya`)
            if(q.length > 500) return reply('Teks terlalu panjang!')
            client.sendMessage(from, `*Pertanyaan:* rate dari ${q}\n\n*Jawaban:* ${Math.floor(Math.random()*100)}%`, text,{quoted: msg})
        }
            break
        case 'jadian':{
            if(!isGroup) return reply(mess.only.group)
            let anak1 = `${pickRandom(groupMembersId)}`
            const index = groupMembersId.indexOf(anak1)
            groupMembersId.splice(index, 1)
            let anak2 = `${pickRandom(groupMembersId)}`
            client.sendMessage(from, `@${anak1.split("@")[0]} ❤️ @${anak2.split("@")[0]}`, text, {
                quoted: msg,
                contextInfo: {mentionedJid: [anak1, anak2]}
            })
        }
            break


/********* Text Maker *********/
//textpro
        case 'pornhub':{
            if (!q) return reply(`Kirim perintah *${userPrefix}pornhub [teks1|teks2]*\ncontoh:\n\n${userPrefix}pornhub anak|dajjal`)
            let data = q.split("|")
            let satu = data[0]
            let dua = data[1]
            if(!dua) return reply('Teks2 nya?')
            let url = await axios.get(`https://edwindefine.herokuapp.com/api/textpro/porn-hub?apikey=${ApiKey}&text1=${satu}&text2=${dua}`)
            if(!url.data.result) return reply(mess.err.teks)
            let buffer = await getBuffer(url.data.result)
            client.sendMessage(from, buffer, image, {
                caption: `*Berhasil Diproses✔️*`, 
                quoted: fToko(2, 'pornhub')
            })
            cmdSuccess('pornhub processed')
        }
            break
        case 'logowolf':{
            if (!q) return reply(`Kirim perintah *${userPrefix}logowolf [teks1|teks2]*\ncontoh:\n\n${userPrefix}logowolf edwin|define`)
            let data = q.split("|")
            let satu = data[0]
            let dua = data[1]
            if(!dua) return reply('Teks2 nya?')
            let url = await axios.get(`https://edwindefine.herokuapp.com/api/textpro/logo-wolf?apikey=${ApiKey}&text=${satu}&text2=${dua}`)
            if(!url.data.result) return reply(mess.err.teks)
            let buffer = await getBuffer(url.data.result)
            client.sendMessage(from, buffer, image, {
                caption: `*Berhasil Diproses✔️*`, 
                quoted: fMsg(2, 'logowolf')
            })
            cmdSuccess('logowolf processed')
        }
            break
        case 'logowolf2':{
            if (!q) return reply(`Kirim perintah *${userPrefix}logowolf2 [teks1|teks2]*\ncontoh:\n\n${userPrefix}logowolf2 edwin|define`)
            let data = q.split("|")
            let satu = data[0]
            let dua = data[1]
            if(!dua) return reply('Teks2 nya?')
            let url = await axios.get(`https://edwindefine.herokuapp.com/api/textpro/logo-wolf2?apikey=${ApiKey}&text=${satu}&text2=${dua}`)
            if(!url.data.result) return reply(mess.err.teks)
            let buffer = await getBuffer(url.data.result)
            client.sendMessage(from, buffer, image, {
                caption: `*Berhasil Diproses✔️*`, 
                quoted: fMsg(2, 'logowolf 2')
            })
            cmdSuccess('logowolf2 processed')
        }
            break
        case 'naturalleaves':{
            if (!q) return reply(`Kirim perintah *${userPrefix}naturalLeaves [teks]*\ncontoh:\n\n${userPrefix}naturalLeaves edwin`)
            let url = await axios.get(`https://edwindefine.herokuapp.com/api/textpro/natural-leaves?apikey=${ApiKey}&text=${q}`)
            if(!url.data.result) return reply(mess.err.teks)
            let buffer = await getBuffer(url.data.result)
            client.sendMessage(from, buffer, image, {
                caption: `*Berhasil Diproses✔️*`, 
                quoted: fMsg(2, 'natural leaves')
            })
            cmdSuccess('naturalleaves processed')
        }
            break
        case 'blackpink':{
            if (!q) return reply(`Kirim perintah *${userPrefix}blackpink [teks]*\ncontoh:\n\n${userPrefix}blackpink edwin`)
            let url = await axios.get(`https://edwindefine.herokuapp.com/api/textpro/black-pink?apikey=${ApiKey}&text=${q}`)
            if(!url.data.result) return reply(mess.err.teks)
            let buffer = await getBuffer(url.data.result)
            client.sendMessage(from, buffer, image, {
                caption: `*Berhasil Diproses✔️*`, 
                quoted: fMsg(2, 'blackpink')
            })
            cmdSuccess('blackpink processed')
        }
            break
        case 'dropwater':{
            if (!q) return reply(`Kirim perintah *${userPrefix}dropwater [teks]*\ncontoh:\n\n${userPrefix}dropwater edwin`)
            let url = await axios.get(`https://edwindefine.herokuapp.com/api/textpro/drop-water?apikey=${ApiKey}&text=${q}`)
            if(!url.data.result) return reply(mess.err.teks)
            let buffer = await getBuffer(url.data.result)
            client.sendMessage(from, buffer, image, {
                caption: `*Berhasil Diproses✔️*`, 
                quoted: fMsg(2, 'drop water')
            })
            cmdSuccess('dropwater processed')
        }
            break
        case 'christmas':{
            if (!q) return reply(`Kirim perintah *${userPrefix}christmas [teks]*\ncontoh:\n\n${userPrefix}christmas edwin`)
            let url = await axios.get(`https://edwindefine.herokuapp.com/api/textpro/christmas?apikey=${ApiKey}&text=${q}`)
            if(!url.data.result) return reply(mess.err.teks)
            let buffer = await getBuffer(url.data.result)
            client.sendMessage(from, buffer, image, {
                caption: `*Berhasil Diproses✔️*`, 
                quoted: fMsg(2, 'christmas')
            })
            cmdSuccess('christmas processed')
        }
            break
        case '3dgradient':{
            if (!q) return reply(`Kirim perintah *${userPrefix}3dgradient [teks]*\ncontoh:\n\n${userPrefix}3dgradient edwin`)
            let url = await axios.get(`https://edwindefine.herokuapp.com/api/textpro/3d-gradient?apikey=${ApiKey}&text=${q}`)
            if(!url.data.result) return reply(mess.err.teks)
            let buffer = await getBuffer(url.data.result)
            client.sendMessage(from, buffer, image, {
                caption: `*Berhasil Diproses✔️*`, 
                quoted: fMsg(2, '3dgradient')
            })
            cmdSuccess('3dgradient processed')
        }
            break
//photooxy
        case 'shadow':{
            if (!q) return reply(`Kirim perintah *${userPrefix}shadow [teks]*\ncontoh:\n\n${userPrefix}shadow edwin`)
            let url = await axios.get(`https://edwindefine.herokuapp.com/api/photooxy/shadow?apikey=${ApiKey}&text=${q}`)
            if(!url.data.result) return reply(mess.err.teks)
            let buffer = await getBuffer(url.data.result)
            client.sendMessage(from, buffer, image, {
                caption: `*Berhasil Diproses✔️*`, 
                quoted: fMsg(2, 'shadow')
            })
            cmdSuccess('shadow processed')
        }
            break
        case 'romantic':{
            if (!q) return reply(`Kirim perintah *${userPrefix}romantic [teks]*\ncontoh:\n\n${userPrefix}romantic edwin`)
            let url = await axios.get(`https://edwindefine.herokuapp.com/api/photooxy/romantic?apikey=${ApiKey}&text=${q}`)
            if(!url.data.result) return reply(mess.err.teks)
            let buffer = await getBuffer(url.data.result)
            client.sendMessage(from, buffer, image, {
                caption: `*Berhasil Diproses✔️*`, 
                quoted: fMsg(2, 'romantic')
            })
            cmdSuccess('romantic processed')
        }
            break
        case 'smoke':{
            if (!q) return reply(`Kirim perintah *${userPrefix}smoke [teks]*\ncontoh:\n\n${userPrefix}smoke edwin`)
            let url = await axios.get(`https://edwindefine.herokuapp.com/api/photooxy/smoke?apikey=${ApiKey}&text=${q}`)
            if(!url.data.result) return reply(mess.err.teks)
            let buffer = await getBuffer(url.data.result)
            client.sendMessage(from, buffer, image, {
                caption: `*Berhasil Diproses✔️*`, 
                quoted: fMsg(2, 'smoke')
            })
            cmdSuccess('smoke processed')
        }
            break
        case 'naruto':{
            if (!q) return reply(`Kirim perintah *${userPrefix}naruto [teks]*\ncontoh:\n\n${userPrefix}naruto edwin`)
            let url = await axios.get(`https://edwindefine.herokuapp.com/api/photooxy/naruto?apikey=${ApiKey}&text=${q}`)
            if(!url.data.result) return reply(mess.err.teks)
            let buffer = await getBuffer(url.data.result)
            client.sendMessage(from, buffer, image, {
                caption: `*Berhasil Diproses✔️*`, 
                quoted: fMsg(2, 'naruto')
            })
            cmdSuccess('naruto processed')
        }
            break
        case 'love':{
            if (!q) return reply(`Kirim perintah *${userPrefix}love [teks]*\ncontoh:\n\n${userPrefix}love edwin`)
            let url = await axios.get(`https://edwindefine.herokuapp.com/api/photooxy/love-message?apikey=${ApiKey}&text=${q}`)
            if(!url.data.result) return reply(mess.err.teks)
            let buffer = await getBuffer(url.data.result)
            client.sendMessage(from, buffer, image, {
                caption: `*Berhasil Diproses✔️*`, 
                quoted: fMsg(2, 'love')
            })
            cmdSuccess('love processed')
        }
            break
        case 'undergrass':{
            if (!q) return reply(`Kirim perintah *${userPrefix}underGrass [teks]*\ncontoh:\n\n${userPrefix}underGrass edwin`)
            let url = await axios.get(`https://edwindefine.herokuapp.com/api/photooxy/message-under-grass?apikey=${ApiKey}&text=${q}`)
            if(!url.data.result) return reply(mess.err.teks)
            let buffer = await getBuffer(url.data.result)
            client.sendMessage(from, buffer, image, {
                caption: `*Berhasil Diproses✔️*`, 
                quoted: fMsg(2, 'underGrass')
            })
            cmdSuccess('underGrass processed')
        }
            break
        case 'doubleheart':{
            if (!q) return reply(`Kirim perintah *${userPrefix}doubleHeart [teks]*\ncontoh:\n\n${userPrefix}doubleHeart edwin`)
            let url = await axios.get(`https://edwindefine.herokuapp.com/api/photooxy/double-heart?apikey=${ApiKey}&text=${q}`)
            if(!url.data.result) return reply(mess.err.teks)
            let buffer = await getBuffer(url.data.result)
            client.sendMessage(from, buffer, image, {
                caption: `*Berhasil Diproses✔️*`, 
                quoted: fMsg(2, 'Double Heart')
            })
            cmdSuccess('doubleHeart processed')
        }
            break
        case 'butterfly':{
            if (!q) return reply(`Kirim perintah *${userPrefix}butterfly [teks]*\ncontoh:\n\n${userPrefix}butterfly edwin`)
            let url = await axios.get(`https://edwindefine.herokuapp.com/api/photooxy/butterfly?apikey=${ApiKey}&text=${q}`)
            if(!url.data.result) return reply(mess.err.teks)
            let buffer = await getBuffer(url.data.result)
            client.sendMessage(from, buffer, image, {
                caption: `*Berhasil Diproses✔️*`, 
                quoted: fMsg(2, 'Butterfly')
            })
            cmdSuccess('butterfly processed')
        }
            break
        case 'coffecup':{
            if (!q) return reply(`Kirim perintah *${userPrefix}coffeCup [teks]*\ncontoh:\n\n${userPrefix}coffeCup edwin`)
            let url = await axios.get(`https://edwindefine.herokuapp.com/api/photooxy/coffe-cup?apikey=${ApiKey}&text=${q}`)
            if(!url.data.result) return reply(mess.err.teks)
            let buffer = await getBuffer(url.data.result)
            client.sendMessage(from, buffer, image, {
                caption: `*Berhasil Diproses✔️*`, 
                quoted: fMsg(2, 'coffe cup')
            })
            cmdSuccess('coffeCup processed')
        }
            break

/********* Search *********/
        case 'igstalk':{
            if (!q) return reply('Usernamenya?')
            try{
                ig.fetchUser(q).then(res => {
                    if(!res.username) returnreply('Tidak bisa menemukan username tersebut!')
                    let pic = `${res.profile_pic_url_hd}`
                    const content = `*ID* : ${res.profile_id}\n*Username* : ${q}\n*Full Name* : ${res.full_name}\n*Bio* : ${res.biography}\n*Followers* : ${res.following}\n*Following* : ${res.followers}\n*Private* : ${res.is_private}\n*Verified* : ${res.is_verified}\n\n*Link* : https://instagram.com/${q}`
                    sendMediaURL(from, pic, content) 
                    cmdSuccess('igstalk processed')
                })      
            }
            catch{
                reply('Tidak bisa menemukan username tersebut!')
            }
        }
            break  

/********* Downloader *********/
        case 'ytmp4':{
            if (!q) return reply(`Kirim perintah *${userPrefix}ytmp4 [linkVideoYt]*\ncontoh:\n\n${userPrefix}ytmp4 https://youtu.be/MVIr6DX9HMo`)
            let isLink = q.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/)
            if (!isLink) return reply(mess.err.link)
            try {
                reply(mess.wait)
                ytv(q)
                    .then((res) => {
                        const { dl_link, thumb, title, filesizeF, filesize } = res                       
                        axios.get(`https://tinyurl.com/api-create.php?url=${dl_link}`)
                            .then((res) => {
                                if (Number(filesize) >= 30000) return sendMediaURL(from, thumb, `*YTMP 4!*\n\n*Title* : ${title}\n*Ext* : MP3\n*Filesize* : ${filesizeF}\n*Link* : ${res.data}\n\n_Untuk durasi lebih dari batas disajikan dalam bentuk link_`)
                                const captionsYtmp4 = `*Data Berhasil Didapatkan!*\n\n*Title* : ${title}\n*Ext* : MP4\n*Size* : ${filesizeF}\n\n_Silahkan tunggu file media sedang dikirim mungkin butuh beberapa menit_`
                                sendMediaURL(from, thumb, captionsYtmp4)
                                sendMediaURL(from, dl_link).catch(() => reply(mess.err.msg))
                                cmdSuccess('ytmp4 Processed')
                            })		
                    })
            } catch (err) {
                reply(mess.err.msg)
            }
        }
            break
        case 'ytmp3':{
            if (!q) return reply(`Kirim perintah *${userPrefix}ytmp3 [linkVideoYt]*\ncontoh:\n\n${userPrefix}ytmp3 https://youtu.be/MVIr6DX9HMo`)
            let isLink = q.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/)
            if (!isLink) return reply(mess.err.link)
            try {
                reply(mess.wait)
                yta(q)
                    .then((res) => {
                        const { dl_link, thumb, title, filesizeF, filesize } = res
                        axios.get(`https://tinyurl.com/api-create.php?url=${dl_link}`)
                            .then((res) => {
                                if (Number(filesize) >= 20000) return sendMediaURL(from, thumb, `*Data Berhasil Didapatkan!*\n\n*Title* : ${title}\n*Ext* : MP3\n*Filesize* : ${filesizeF}\n*Link* : ${res.data}\n\n_Untuk durasi lebih dari batas disajikan dalam bentuk link_`)
                                const captions = `*Data Berhasil Didapatkan!*\n\n*Title* : ${title}\n*Ext* : MP3\n*Size* : ${filesizeF}\n\n_Silahkan tunggu file media sedang dikirim mungkin butuh beberapa menit_`
                                sendMediaURL(from, thumb, captions)
                                sendMediaURL(from, dl_link).catch(() => reply(mess.err.msg))
                                cmdSuccess('ytmp3 Processed')
                            })
                    })
            } catch (err) {
                reply(mess.err.msg)
            }
        }
            break
        case 'ig':{
            if (!q) return reply(`Kirim perintah *${userPrefix}ig [linkPostinganIg]*`)
            if (!isUrl(q) && !q.includes('instagram.com')) return reply(mess.err.link)
            reply(mess.wait)
            hx.igdl(q)
                .then(async(res) => {
                    if(!res.medias) return reply(`*Gagal mendapatkan data*\nMungkin karena postingan tersebut berasal dari user yang diprivate!`)
                    for(let i of res.medias){
                        if(i.url.includes('mp4')){
                            let link = await getBuffer(i.url)
                            client.sendMessage(from, link, video, {quoted: msg, caption: `Type : ${i.type}`})
                        } else {
                            let link = await getBuffer(i.url)
                            client.sendMessage(from, link, image, {quoted: msg, caption: `Type : ${i.type}`})                  
                        }
                    }
                    cmdSuccess('ig downloader Processed')
                }).catch(e => {
                    reply(mess.err.msg)
                    console.log(e)
                })
        }
            break
        case 'igstory':{
            if(!q) return reply(`Kirim perintah *${userPrefix}igStory [username]*`)
            reply(mess.wait)
            hx.igstory(q)
                .then(async res => {
                    if(!res.medias) return reply(`*Gagal mendapatkan data*\nMungkin karena user *${q}* adalah akun private atau tidak membuat story apapun!`) 
                    for(let i of res.medias){
                        if(i.url.includes('mp4')){
                            let link = await getBuffer(i.url)
                            client.sendMessage(from, link, video, {quoted: msg, caption: `Type : ${i.type}`})
                        } else {
                            let link = await getBuffer(i.url)
                            client.sendMessage(from, link, image, {quoted: msg, caption: `Type : ${i.type}`})                  
                        }
                    }
                    cmdSuccess('igstory Processed')
                    
                }).catch(e => {
                    reply(mess.err.msg)
                    console.log(e)
                })
        }
            break
        case 'tiktok':{
            if (!q) return reply(`Kirim perintah *${userPrefix}tiktok [linkPostinganTiktok]*`)
            if (!isUrl(q) && !q.includes('tiktok.com')) return reply(mess.err.link)
            reply(mess.wait)
            hx.ttdownloader(`${q}`)
                .then(res => {
                    const { wm, nowm, audio } = res
                    axios.get(`https://tinyurl.com/api-create.php?url=${nowm}`)
                        .then(async (res) => {
                            let content = `*Link* : ${res.data}`
                            client.sendMessage(from, {url:`${nowm}`}, video, {
                                mimetype:'video/mp4',
                                quoted: msg,
                                caption: `*Berhasil Mendapatkan Data✔️*`
                            })
                        })
                    cmdSuccess('tiktok downloader Processed')
                }).catch(e => {
                    reply(mess.err.msg)
                    console.log(e)
                })
        }
            break
        case 'pinterest':{
            if (!q) return reply(`Kirim perintah *${userPrefix}pinterest [query]*`)
            let pin = await hx.pinterest(q)
            let random = pin[Math.floor(Math.random() * pin.length)]
            let gambar = await getBuffer(random)
            await client.sendMessage(from, gambar, image, {quoted: msg})
            cmdSuccess('pinterest downloader Processed')
        }
            break

/********* More *********/        
        

    }

}
