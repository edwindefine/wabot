/***************** MODULES *****************/
const { 
    WAConnection, 
    MessageType, 
    Mimetype, 
    WA_DEFAULT_EPHEMERAL
} = require('@adiwajshing/baileys')
const fs = require('fs')
const ffmpeg = require('fluent-ffmpeg')
const imageToBase64 = require('image-to-base64')
const { exec, spawn } = require("child_process");
const moment = require("moment-timezone")
const got = require('got')
const hx = require('hxz-api');
const speed = require('performance-now')

/***************** UTILS *****************/
const { 
    text,
    extendedText, 
    contact, 
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
    fReplyCmd, 
    fakeReply, 
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
} = require('../message/fakeReply')
const {createExif, execSticker, execWebp} = require('../sticker/function')
const {getBuffer, start, info, success, close, getGroupAdmins, getGroupMembersId} = require('../lib/function')
const {color, bgColor, hexColor} = require('../lib/color')
const {pttCmd, pttCustom} = require('../lib/ptt');
const { menu } = require('../message/menu');


/******** JSON AND ASSETS ********/
const {ownerNumber, mediaUrl} = JSON.parse(fs.readFileSync('./config.json'))
let boolean = JSON.parse(fs.readFileSync('./database/boolean.json'))
let stickerCommand = JSON.parse(fs.readFileSync('./sticker/filesha256.json'))
let banchat = JSON.parse(fs.readFileSync('./database/banchat.json'))
let antiLink = JSON.parse(fs.readFileSync('./database/antilink.json'))
let antiVirtex = JSON.parse(fs.readFileSync('./database/antivirtex.json'))

let imagePreview = fs.readFileSync('./assets/image/cecan.jpg')

moment.tz.setDefault("Asia/Jakarta").locale("id");

module.exports = async (chatUpdate, client) => {
    if (!chatUpdate.hasNewMessage) return
    const msg = chatUpdate.messages.all()[0]
    if (!msg.message) return
    if (msg.key && msg.key.remoteJid == 'status@broadcast') return
    msg.message = (Object.keys(msg.message)[0] === 'ephemeralMessage') ? msg.message.ephemeralMessage.message : msg.message
    if(msg.status === 2) return
    
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
    const prefix = '/'
    // const prefix = /^[π×£€¥!#$^./\\©^]/.test(pureCommand) ? pureCommand.match(/^[π×£€¥!#$^./\\©^]/gi) : '-'
    // const prefix = body && body.length>1 ? body[1].toUpperCase() : ''       
    const isCmd = pureCommand ? pureCommand[0] == prefix : false
    let command = pureCommand.slice(1, pureCommand.length).toLowerCase()

    
    /******************** VALIDATOR ********************/
    
    const isGroup = from.includes('@g.us')
    const sender = msg.key.fromMe ? client.user.jid : isGroup ? msg.participant : msg.key.remoteJid
    const isOwner = ownerNumber.includes(sender)
    let isPublic = boolean.isPublic

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
    const reply2 = (teks) => {client.sendMessage(from, teks, text, {quoted: msg, thumbnail: fs.readFileSync(`./assets/image/karma_akabane_mini.jpg`)})}//terlihat image saat reply
    const fReply = (teks) => {client.sendMessage(from, teks, text, {quoted:fMsg(2, 'Bot Verified'), contextInfo:{mentionedJid:sender}})}

    /*message option*/
    //sendEphemeral: true //agar pesan terhapus setelah 7 hari
    //contextInfo:{forwardingScore: 500, isForwarded: true},//cara mengirim pesan yang terlihat diteruskan 

    /***************** END MESSAGE PROCESSED *****************/


    
    /********** FUNCTION **********/

    const vCard = 'BEGIN:VCARD\n' // metadata of the contact card
        + 'VERSION:3.0\n' 
        + 'FN:Edwin [High Definition]\n' // full name
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

    /********** END FUNCTION **********/
    


    /******************** COMMAND ********************/


    /****** Checker ******/
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

    //add sticker command
    if(command === 'asc'){
        if(!isOwner) return
        if(!isQuotedSticker) return reply('Stickernya?')
        if(!q) return reply('Masukan value command untuk sticker!')
        for(let i = 0; i<stickerCommand.length; i++){
            if(msg.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage.fileSha256.toString() == stickerCommand[i].key){
                return reply('Sticker tersebut telah terisi command!')
            }
        }
        const buffer = msg.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage.fileSha256.toString()
        const command = q
        stickerCommand.push({key:buffer,value:command})
        fs.writeFileSync('./sticker/filesha256.json', JSON.stringify(stickerCommand), (err) => { if(err) throw err })
        stickerCommand = JSON.parse(fs.readFileSync('./sticker/filesha256.json'))
        fReply('Sticker Command Ditambahkan✔️')
    }
    //remove sticker command
    if(command === 'rsc'){
        if(!isOwner) return
        if(!q) return reply('Masukan command sticker yang mau dihapus!')
        for(let i = 0; i<stickerCommand.length; i++){
            if(q.toLowerCase() == stickerCommand[i].value.toLowerCase()){
                let i2 = i===0?1:i
                stickerCommand.splice(i, i2)
                fs.writeFileSync('./sticker/filesha256.json', JSON.stringify(stickerCommand), (err) => { if(err) throw err })
                stickerCommand = JSON.parse(fs.readFileSync('./sticker/filesha256.json'))
                return fReply('Berhasil menghapus command✔️')
            }
        }
        reply('❌Tidak bisa menemukan command sticker tersebut')
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
            contentText: menu(pushname, prefix, sender, timeWita, isPublic),
            footerText: `Creator Bot Whatsapp\n© edwin Bot 𝐕1`,
            buttons: [
                {buttonId: 's&k', buttonText: {displayText: 'S&K'}, type: 1}
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
    else if (userButtonResponse == 'contact creator') {
        client.sendMessage(from, {displayName: 'Edwin', vcard: vCard}, contact, { quoted: msg })
        fReply('Ini Creator Saya')
    }
    else if (userButtonResponse == 'speed run') {
        const timestamp = speed();
        const latensi = speed() - timestamp 
        p0 =`Speed :\n${latensi.toFixed(4)} Second`
        fReply(p0)
    }

    
    switch(command){
/******** Main Command ********/
        case 'testo':{//for test
            // client.sendMessage(from, 'stw', text, {quoted: { 
            //     key: {
            //         fromMe: false, 
            //         participant: `0@s.whatsapp.net`, 
            //         ...({remoteJid : "status@broadcast"})
            //     },
            //     message: { 
            //         "imageMessage": { 
            //             "mimetype": "image/png", 
            //             "caption": '*',
            //             //"jpegThumbnail": image
            //         } 
            //     }
            // }, thumbnail: fs.readFileSync(`./assets/image/karma_akabane_mini.jpg`)})
            client.sendMessage(from, fs.readFileSync('./assets/image/nagapixel smp.jpg'), image, {
                thumbnail: fs.readFileSync('./assets/image/karma_akabane_wm.jpg'),
                caption: 'makan semua ajg!'
            })
        }
            break
        case 'menu':
        case 'tes':
        case 'help':{
            const buttons = [
                {buttonId: 'speed', buttonText: {displayText: 'speed run'}, type: 1},
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
                contentText: 'Active!',
                footerText: `Creator Bot Whatsapp\n© edwin Bot 𝐕1`,
                buttons: buttons,
                headerType: 4
            }
            await client.sendMessage(from, content, buttonsMessage, {
                quoted: fKontak(0, pushname),
                contextInfo: {
                    sendEphemeral: true,
                    mentionedJid: [sender],
                    "externalAdReply": {
                        "title": `Shut Up your Mouth`,
                        "body": ``,
                        "previewType": "PHOTO",
                        "thumbnailUrl": mediaUrl.karma_akabane_mini_wm,
                        "thumbnail": '',
                        "sourceUrl": ''
                    }
                },
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
        case 'getid':{
            if(!isOwner) return
            await client.sendMessage('6285829271476@s.whatsapp.net', groupName ? groupName : pushname+'\n'+from, text)
            cmdSuccess('Group id obtained')
        }
            break
       


/******** Owner ********/
        case 'public':{
            if(!isOwner) return
            if(isPublic === true) return
            boolean.isPublic = true
            fs.writeFileSync('./database/boolean.json', JSON.stringify(boolean))
            boolean = JSON.parse(fs.readFileSync('./database/boolean.json'))//membaca ulang json file
            fReply(`「 *PUBLIC-MODE* 」`)
        }
            break
        case 'self':{
            if(!isOwner) return
            if(isPublic === false) return
            boolean.isPublic = false
            fs.writeFileSync('./database/boolean.json', JSON.stringify(boolean))
            boolean = JSON.parse(fs.readFileSync('./database/boolean.json'))
            fReply(`「 *SELF-MODE* 」`)
        }
            break
        case 'antidel':{
            if(!isGroupAdmins) return
            if(!q) return reply('pilih aktif/nonaktif')
            let antidel = boolean.antidel
            if(q.toLowerCase() === 'aktif' || q.toLowerCase() === 'true' && antidel === false) {
                boolean.antidel = true
                fs.writeFileSync('./database/boolean.json', JSON.stringify(boolean))
                boolean = JSON.parse(fs.readFileSync('./database/boolean.json'))
                fReply(`「 *ANTIDEL AKTIF* 」`)
            } else if(q.toLowerCase() === 'aktif' || q.toLowerCase() === 'true' && antidel === true)
                boolean.antidel = false
                fs.writeFileSync('./database/boolean.json', JSON.stringify(boolean))
                boolean = JSON.parse(fs.readFileSync('./database/boolean.json'))
                fReply(`「 *ANTIDEL NONAKTIF* 」`)
        }
            break
        case 'saveimg':{
            if(!isOwner) return
            if(!q) return reply('nama image nya?')
            // const existFile = fs.readdirSync('./assets/saveImage')
            // if(existFile.includes(q)) q = q+`${Math.floor(Math.random()*10000)}`
            const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM','m')).message.extendedTextMessage.contextInfo : msg
            await client.downloadAndSaveMediaMessage(encmedia, `./assets/saveImage/${q}`)
            fReply('Selesai Menyimpan Image✔️')
        }
            break
        case 'buggc':{
            if(!isOwner) return
            client.toggleDisappearingMessages(from)
            fReply('Hehey Not Bad')
        }
            break

/******** Group ********/
        case 'antilink':{
            if (!isGroup) return reply('Command kusus group!')
            if (!isGroupAdmins) return reply('Hanya untuk admin!')
            if (!isBotGroupAdmins) return reply('Jadiin Bot admin dulu!')
            if (!q) return reply(`untuk menggunakan command ini ketik :\n${prefix}antilink aktif/nonaktif`)
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
            if (!isGroup) return reply('Command kusus group!')
            if (!isGroupAdmins) return reply('Hanya untuk admin!')
            if (!isBotGroupAdmins) return reply('Jadiin Bot admin dulu!')
            if (!q) return reply(`untuk menggunakan command ini ketik :\n${prefix}antilink aktif/nonaktif`)
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
            if (!isGroup) return reply('Command kusus group!')
            if (!isGroupAdmins) return reply('Hanya untuk admin!')
            if (!isBotGroupAdmins) return reply('Jadiin Bot admin dulu!')
            if (!q) return reply(`Nomor yang mau di add?`)
            try {
                let nomor = `${convertNumber(q)}@s.whatsapp.net`
                client.groupAdd(from, [nomor])
                    .catch(reply('Gagal menambahkan nomor, Pastikan nomornya sudah benar!'))
            } catch (e) {
                console.log('Error :', e)
                reply('Gagal menambahkan nomor, mungkin karena di private')
            }
        }
            break
        case 'kick':{
            if (!isGroup) return reply('Command kusus group!')
            if (!isGroupAdmins) return reply('Hanya untuk admin!')
            if (!isBotGroupAdmins) return reply('Jadiin Bot admin dulu!')
            if (msg.message.extendedTextMessage === null || msg.message.extendedTextMessage === undefined) return reply('Mention member yang mau dikick!');
            if (msg.message.extendedTextMessage.contextInfo.participant === undefined) {
                const target = msg.message.extendedTextMessage.contextInfo.mentionedJid
                if (target.length > 1) {
                    let memberId = []
                    for (let id of target) {
                        memberId.push(id)
                    }
                    client.groupRemove(from, memberId)
                } else client.groupRemove(from, [target[0]])
            } else {
                const target = msg.message.extendedTextMessage.contextInfo.participant
                client.groupRemove(from, [target])
            }
            const content = `Sukses melakukan kick✔️`
            reply(content)
        }
            break
        case 'promote':{
            if (!isGroup) return reply('Command kusus group!')
            if (!isGroupAdmins) return reply('Hanya untuk admin!')
            if (!isBotGroupAdmins) return reply('Jadiin Bot admin dulu!')
            if (msg.message.extendedTextMessage === null || msg.message.extendedTextMessage === undefined) return reply('Mention member yang mau promote!');
            if (msg.message.extendedTextMessage.contextInfo.participant === undefined) {
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
            if (!isGroup) return reply('Command kusus group!')
            if (!isGroupAdmins) return reply('Hanya untuk admin!')
            if (!isBotGroupAdmins) return reply('Jadiin Bot admin dulu!')
            if (msg.message.extendedTextMessage === null || msg.message.extendedTextMessage === undefined) return reply('Mention member yang mau demote!');
            if (msg.message.extendedTextMessage.contextInfo.participant === undefined) {
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
            
        case 'linkgc':
        case 'linkgrup':
        case 'linkgroup':{
            if (!isGroup) return reply('Command kusus group!')
            if (!isBotGroupAdmins) return reply('Jadiin Bot admin dulu!')
            const linkGc = await client.groupInviteCode(from)
            const content = `\`\`\`「 Link Group 」\`\`\`\n\n•> Group *${groupName}* :\nhttps://chat.whatsapp.com/${linkGc}\n\nRamein ya...`
            fReply(content)
        }
            break
        case 'hidetag':{
            if (!isGroup) return reply('Command kusus group!')
            if (!isGroupAdmins) return reply('Hanya untuk admin!')
            !q ? client.sendMessage(from, 'Hallo', extendedText, {contextInfo: {"mentionedJid": groupMembersId}}) : client.sendMessage(from, q, extendedText, {contextInfo: {"mentionedJid": groupMembersId}})
        }
            break
        case 'stag':{
            if (!isGroup) return reply('Command kusus group!')
            if (!isGroupAdmins) return reply('Hanya untuk admin!')
            const sName = './sticker/sTag.webp'
            client.sendMessage(from, fs.readFileSync(sName), sticker, {contextInfo: {"mentionedJid": groupMembersId}})
        }
            break
        case 'gpic':{
            let target = !isGroup ? from : type === 'conversation' ? client.user.jid : type === 'extendedTextMessage' ? msg.message.extendedTextMessage.contextInfo.mentionedJid[0] : ''
            let pic = '';
            try{ pic = await client.getProfilePicture(target) }
            catch{ pic = mediaUrl.no_profile }
            let pp = await getBuffer(pic)
            await client.sendMessage(from, pp, image, {quoted : msg})
        }
            break


/********* Fake Test *********/
        case 'freply':{
            const fakeReplyy = await fakeReply(q)
            if(fakeReplyy !== false) {
                !args[1] ? reply('Mau fake reply yang mana?') : client.sendMessage(from, 'You Know?', extendedText, { quoted : fakeReplyy(0) })
            } else reply(`Yang tersedia cuma : \n\n${fReplyCmd.toString()}`)
            //'msg, vn, image, video, toko, troli, gif, location, doc, invite, stk'
            cmdSuccess('freply processed')
        }
            break
        case 'fakeurl':{
            client.sendMessage(from, `*Wake Up Brother*`, text, {
                contextInfo: {
                    sendEphemeral: true,
                    mentionedJid: [sender],
                    "externalAdReply": {
                        "title": `Shut Up your Mouth`,
                        "body": ``,
                        "previewType": "PHOTO",
                        "thumbnailUrl": mediaUrl.karma_akabane_mini_wm,
                        "thumbnail": "",//fs.readFileSync('./assets/image/karma_akabane_mini.jpg'),
                        "sourceUrl": ''//"https://edwindefine.000webhostapp.com"
                    }
                }, quoted: msg})
            cmdSuccess('Fake Url processed')
        }
            break
        case 'fakeinvite':{
            client.sendMessage(from, {
                groupJid: "6285829271476-1621774709@g.us",
                inviteCode: 'eHk94nePYV38fjX+',
                inviteExpiration: 1,
                groupName: 'NagaPixel',
                jpegThumbnail: fs.readFileSync('./assets/image/karma_akabane_mini.jpg'),
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
            client.sendMessage(from, {
                product: {
                    // productImage: ImageMessage {
                    // interactiveAnnotations: [],
                    // scanLengths: [],
                    // url: 'https://mmg.whatsapp.net/d/f/Ag5eTW6anoK4SUlXLkFrxr3tyKUkPbe2Dko0_xBMCrxO.enc',
                    // mimetype: 'image/jpeg',
                    // fileSha256: <Buffer 93 41 44 5b aa 5a c2 1a 45 ab 17 4a 57 29 a0 b1 c5 06 5e a1 e2 35 6d 88 d2 35 d6 da 57 f2 15 30>,
                    // fileLength: Long { low: 117943, high: 0, unsigned: true },
                    // height: 1134,
                    // width: 1080,
                    // mediaKey: <Buffer 32 9e db 34 09 60 40 b8 95 9f 01 df 9b da bb d4 71 e6 55 78 6c 0f d0 30 b2 c3 ed a5 9f 48 19 0d>,
                    // fileEncSha256: <Buffer 87 22 64 9c ae e5 a2 af 0d a2 41 2b 4f e1 08 8f 32 04 66 08 63 dd 52 55 6d d1 b2 b8 54 99 cb d1>,
                    // directPath: '/v/t62.7118-24/31601662_136245365332000_3413680619294351847_n.enc?ccb=11-4&oh=87a597698ebd843e421c4ccf61fbcfb7&oe=613FF013&_nc_hot=1629114041',
                    // mediaKeyTimestamp: Long { low: 1629105834, high: 0, unsigned: false },
                    // jpegThumbnail: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 00 00 01 00 01 00 00 ff db 00 84 00 1b 1b 1b 1b 1c 1b 1e 21 21 1e 2a 2d 28 2d 2a 3d 38 33 33 38 3d 5d 42 47 42 ... 779 more bytes>
                    // },
                    productImage: fs.readFileSync('./assets/image/karma_akabane_wm.jpg'),
                    productId: '4257516651004968',
                    title: 'HELLO',
                    description: 'Halo bang',
                    currencyCode: 'IDR',
                    productImageCount: 1
                },
                businessOwnerJid: '6285829271476@s.whatsapp.net',
                contextInfo: {}
            }, product)
            cmdSuccess('fake Product Processed')
        }
            break

/******** Sticker ********/
        case 'stk':
        case 'stiker':
        case 'sticker':
        case 'stickers':
        case 's':{
            if(type !== 'videoMessage' && type !== 'imageMessage' && !isQuotedImage && !isQuotedVideo) return reply(`Kirim media gambar/video/gif dengan caption ${prefix}sticker`)
            if ((type === 'videoMessage' && msg.message.videoMessage.seconds > 10 || isQuotedVideo && msg.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds > 10)) return reply('max durasi video 10 detik!')
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
            if(type !== 'videoMessage' && type !== 'imageMessage' && !isQuotedImage && !isQuotedVideo) return reply(`Kirim media gambar/video/gif dengan caption ${prefix}sticker`)
            if ((type === 'videoMessage' && msg.message.videoMessage.seconds > 10 || isQuotedVideo && msg.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds > 10)) return reply('max durasi video 10 detik!')
            const encmedia = isQuotedVideo || isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM','m')).message.extendedTextMessage.contextInfo : msg
            const media = await client.downloadAndSaveMediaMessage(encmedia, './sticker/stk')
            const data = q.split('|')
            const satu = data[0] !== '' ? data[0] : `edwindefine`
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
            if (!isQuotedSticker) return reply('reply stickernya om')
            const encmedia = JSON.parse(JSON.stringify(msg).replace('quotedM','m')).message.extendedTextMessage.contextInfo
            const media = await client.downloadAndSaveMediaMessage(encmedia, './sticker/stk')
            const data = q.split('|')
            const satu = data[0] !== '' ? data[0] : `edwindefine`
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
        case 'toimg':{
            if (!isQuotedSticker) return reply('reply stickernya om')
            let encmedia = JSON.parse(JSON.stringify(msg).replace('quotedM','m')).message.extendedTextMessage.contextInfo
            let media = await client.downloadAndSaveMediaMessage(encmedia, './sticker/toimg')
            if (msg.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage.isAnimated === true){
                reply(`Blum support sticker gif :/`)
            } else {
                let imgName = './sticker/image.png'
                exec(`ffmpeg -i ${media} ${imgName}`, (err) => {
                    fs.unlinkSync(media)
                    if (err) return reply('Gagal :V')
                    client.sendMessage(from, fs.readFileSync(imgName), image, {quoted: msg, caption: '.'})
                    fs.unlinkSync(imgName)
                })
            }
        }
            break
        case 'attp':{
            if (args.length < 2) return reply(`Kirim perintah *${prefix}attp* teks`)
            let attp = await getBuffer(`https://api.xteam.xyz/attp?file&text=${encodeURIComponent(q)}`)
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
                quoted:msg,
                thumbnail: imagePreview,
            })
            cmdSuccess(`Sending WallAnime`)
        }
            break   

/********* More *********/
        case 'customptt':{
            const pttCustomm = await pttCustom(q)
            if(pttCustomm !== false) {
                !args[1] ? reply('Mau custom ptt yang mana?') : client.sendMessage(from, { url: pttCustomm }, audio, { mimetype: Mimetype.mp4Audio, ptt : true })
            } else reply(`Yang tersedia cuma : \n\n${pttCmd.toString()}`)
            //'ngen, haa, mou, ara, kana, mgl, trig, mask, rude, 24kgoldn, yamete, shop, campion, beggin, lemont, mencarialasan'
            cmdSuccess('custom ptt processed')
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
            

/********** Lainnya **********/
        
        

    }

}