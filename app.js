/***************** MODULES *****************/
const { 
    WAConnection, 
    MessageType, 
    Mimetype, 
    WA_DEFAULT_EPHEMERAL
} = require('@adiwajshing/baileys')
const fs = require('fs')
const qrcode = require("qrcode-terminal")
//express for running in heroku
const express = require('express')
const app = express()
const port = process.env.PORT || 8080;
app.listen(port)

app.get('/', function (req, res) {
  res.send('hello world')
})
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
} = require('./message/fakeReply')
const msgHandler = require('./message/msgHandler');
const {getBuffer, start, info, success, close, getGroupAdmins, getGroupMembersId} = require('./lib/function')
const {color, bgColor, hexColor} = require('./lib/color')
const {ownerNumber, mediaUrl} = JSON.parse(fs.readFileSync('./config.json'))
let welcomeGroup = JSON.parse(fs.readFileSync('./database/welcomeGroup.json'))
let boolean = JSON.parse(fs.readFileSync('./database/boolean.json'))


// function
async function connectToWhatsApp () {
    const client = new WAConnection()
    client.version =  [2, 2119, 6]
	client.logger.level = 'warn'	 

    const sessionData = './auth_info.json'

    client.on('qr', qr => {
        qrcode.generate(qr, { small: true })
        console.log(color('(+)','white'),color('Whatsapp Bot','red'),color('(+)','white'),color(' SCAN CODENYA! ','aqua'),color('edwindefine','yellow'))
        // console.log(color('(+)','white'),color('Edwin','red'),color('(+)','white'),color(' SCAN CODENYA!','aqua'),color(' You','white'),color('Tube :','red'),color('edwindefine','yellow'))
    }) 
    client.on('credentials-updated', () => {
        const authInfo = client.base64EncodedAuthInfo()
		fs.writeFileSync(sessionData, JSON.stringify(authInfo, null, '\t'))
		console.log(`credentials updated!`)
	})
    //exist and load session file
    fs.existsSync(sessionData) && client.loadAuthInfo(sessionData)
    client.on('connecting', () => {
        start('2', color('[ ! ]Connecting....','aqua'))
	})
	client.on('open', () => {
        success('2', hexColor('[ ! ]Connected.\n','#00ff00'))
        if(fs.existsSync(sessionData) == false){
            const authInfo = client.base64EncodedAuthInfo()
            fs.writeFileSync(sessionData, JSON.stringify(authInfo, null, '\t'))
        }
	})
	client.connect();

    
    client.on('group-participants-update', async (participantsUpdate) => {
        const partis = participantsUpdate
		// if (!welcomeGroup.includes(partis.jid)) return
		try {
            console.log(partis)
            let number = partis.participants[0]
            let groupId = partis.jid
			const groupMetadata = await client.groupMetadata(groupId)
            const pushname = client.contacts[number] != undefined ? client.contacts[number].vname || client.contacts[number].notify : number.split("@")[0]

            //user pic
            let userPic = ''
            try { userPic = await client.getProfilePicture(number) } 
            catch { userPic = mediaUrl.no_profile }
            let userPp = await getBuffer(userPic)
            
            //group pic
            let groupPic = ''
            try { groupPic = await client.getProfilePicture(groupId) } 
            catch { groupPic = mediaUrl.no_profile_group }
            let groupPp = await getBuffer(groupPic)

            const gambar = await client.prepareMessage(groupId, userPp, image, {thumbnail: userPp})

			if (partis.action == 'add') {
                const content = {
                    imageMessage: gambar.message.imageMessage,
                    contentText: `Hallo *@${number.split("@")[0]}*, selamat datang di group *${groupMetadata.subject}*`,
                    footerText: `Welcome New Member`,
                    buttons: [
                        {buttonId: 'welcome', buttonText: {displayText: 'Siap Bro!'}, type: 1}
                    ],
                    headerType: 4
                }
                client.sendMessage(groupId, content, buttonsMessage, {
                    quoted : fInvite(0, `${number.split("@")[0]} Join`, groupPp),
                    contextInfo: {mentionedJid: [number]}
                })
			} else if (partis.action == 'remove') {
                const content = {
                    imageMessage: gambar.message.imageMessage,
                    contentText: `Selamat Tinggal *@${number.split("@")[0]}*`,
                    footerText: `Good Bye`,
                    buttons: [
                        {buttonId: 'bye', buttonText: {displayText: 'Bye!'}, type: 1}
                    ],
                    headerType: 4
                }
                client.sendMessage(groupId, content, buttonsMessage, {
                    quoted : fInvite(0, `${number.split("@")[0]} Leave`, groupPp),
                    contextInfo: {mentionedJid: [number]}
                })
			}
		} catch (e) {
			console.log('Error : '+e)
		}

    })

    client.on('chat-update', async (chatUpdate) => {
        msgHandler(chatUpdate, client)
    })

    client.on('message-delete', async (msg) => {
        let antidel = boolean.antidel
        if (msg.key.remoteJid == 'status@broadcast') return
        if (!msg.key.fromMe && msg.key.fromMe) return
        if (antidel === false) return
        msg.message = (Object.keys(msg.message)[0] === 'ephemeralMessage') ? msg.message.ephemeralMessage.message : msg.message
        const timeWita = moment.tz('Asia/Makassar').format('HH:mm:ss')
        let date = new Date
        let locale = 'id'
        let week = date.toLocaleDateString(locale, { weekday: 'long' })
        let calender = date.toLocaleDateString(locale, {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
        // let gmt = new Date(0).getTime() - new Date('1 Januari 2021').getTime()
        // let weton = ['Pahing', 'Pon','Wage','Kliwon','Legi'][Math.floor(((date * 1) + gmt) / 84600000) % 5]
        const type = Object.keys(msg.message)[0]
        client.sendMessage(msg.key.remoteJid, `━━━━⬣  𝘼𝙉𝙏𝙄 𝘿𝙀𝙇𝙀𝙏𝙀  ⬣━━━━
            *Nama  : @${msg.participant.split("@")[0]}*
            *Jam  : ${timeWita} ${week} ${calender}*
            *Type  : ${type}*
        ━━━━⬣  𝘼𝙉𝙏𝙄 𝘿𝙀𝙇𝙀𝙏𝙀  ⬣━━━━`, MessageType.text, {quoted: msg.message, contextInfo: {"mentionedJid": [msg.participant]}})
        client.copyNForward(msg.key.remoteJid, msg.message)
    })
}

// run
connectToWhatsApp ()
.catch (err => console.log("unexpected error: " + err) )
