const fs = require('fs')

const miniThumbnail = fs.readFileSync('./assets/image/karma_akabane_mini.jpg')

const keyType = [
    {
        fromMe: false, 
        participant: `0@s.whatsapp.net`, 
        ...({remoteJid : "0@s.whatsapp.net"})
    },
    { 
        fromMe: false, 
        participant: `0@s.whatsapp.net`, 
        ...({remoteJid : "6285829271476-1621774709@g.us"})
    },
    {
        fromMe: false, 
        participant: `0@s.whatsapp.net`, 
        ...({remoteJid : "status@broadcast"})
    }
]

const defaultTeks = 'Shut Up'

module.exports = {
                            
    fMsg : (type, teks = defaultTeks) => {
        return {
            key: keyType[type],
            message: { 
                "extendedTextMessage": {
                    "text": teks,
                }
            } 
        }
    },
    fVn : (type) => {
        return {
            key: keyType[type],
            message: { 
                "audioMessage": {
                    "mimetype":"audio/ogg; codecs=opus",
                    "seconds": "999999",
                    "ptt": "true"
                }
            } 
        } 
    },
    fGif : (type, teks = defaultTeks, image = miniThumbnail) => {
        return { 
            key: keyType[type], 
            message: { 
                "videoMessage": {  
                    "title":"Hello Brother",
                    'seconds': '99999', 
                    'gifPlayback': 'true', 
                    'caption': teks,
                    "jpegThumbnail": image
                } 
            } 
        }
    },
    fImage : (type, teks = defaultTeks, image = miniThumbnail) => { 
        return { 
            key: keyType[type],
            message: { 
                "imageMessage": { 
                    "mimetype": "image/png", 
                    "caption": teks,
                    "jpegThumbnail": image
                } 
            }
        }
    },
    fVideo : (type, teks = defaultTeks, image = miniThumbnail) => {
        return {
            key: keyType[type],
            message: { 
                "videoMessage": { 
                    "title":"Hello Brother",
                    'seconds': '99999', 
                    'caption': teks,
                    'jpegThumbnail': image
                }
            }
        }
    },
    fDoc : (type, teks = defaultTeks) => {
        return { 
            key: keyType[type], 
            message: { 
                documentMessage: {
                    mimetype: 'application/zip',
                    title: 'edwindefine',
                    fileLength: 1,
                    pageCount: 0,
                    fileName: teks
                }
            }
        }
    },
    fLoc : (type, teks = defaultTeks, image = miniThumbnail) => {
        return { 
            key: keyType[type], 
            message: { 
                "locationMessage": {
                    "caption": teks,
                    "jpegThumbnail": image
                }
            }
        }
    },
    fLiveLoc : (type, teks = defaultTeks) => {
        return { 
            key: keyType[type], 
            message: { 
                "liveLocationMessage": {
                    "caption": teks,
                    // "degreesLatitude": -8.5750246,
                    // "degreesLongitude": 115.3325313,
                    // "sequenceNumber": Long { low: 0, high: 0, unsigned: false }
                }
            }
        }
    },
    fKontak : (type, teks = defaultTeks) => {
        return { 
            key: keyType[type], 
            message: { 
                contactMessage: {
                    displayName: teks,
                    vcard: 'BEGIN:VCARD\n'
                    + 'VERSION:3.0\n' 
                    + 'FN:Edwin\n'
                    + 'ORG:NASA CORPORATION✓;\n'
                    + 'TEL;type=CELL;type=VOICE;waid=6285829271476:+62 858-2927-1476\n'
                    + 'END:VCARD'
                }
            }
        }
    },
    fInvite : (type = 0, teks = defaultTeks, image = miniThumbnail) => {
        return { 
            key: keyType[0],//tidak support keytype lain(cuma support yang array 0)
            message: { 
                groupInviteMessage: {
                    groupJid: "6285829271476-1621774709@g.us",
                    inviteCode: 'eHk94nePYV38fjX+',
                    groupName: 'NagaPixel',
                    caption: teks,
                    jpegThumbnail: image
                }
            }
        }

    },
    fSticker : (type, teks = defaultTeks) => {
        return { 
            key: keyType[type], 
            "message": {
                "stickerMessage": { 
                    "url":"https://mmg.whatsapp.net/d/f/ApnnxwWzOWeE7U1nud0Nk4bk5AnCvijxM9pK0bXWA0Tv.enc",
                    "fileSha256":"KMd/SiBKB5/4GIPOhI/9oPx3TXxuhRnp4+811FQNf8A=",
                    "fileEncSha256":"e1m6DZs+NX3UElaTvgvpnx1SvH7HRsC2eHF4tHyImwc=",
                    "mediaKey":"NRKH5+pf6ao2r5ZRyvNt/4PHKdzF9eWPTh5DEWH9Z8Q=",
                    "mimetype":"image/webp",
                    "height":64,
                    "width":64,
                    "directPath":"/v/t62.15575-24/28881928_861175107845656_8273043658867035591_n.enc?ccb=11-4&oh=437552e67752275472bb3ef12c1fb107&oe=61413A90",
                    "fileLength":"36082",
                    "mediaKeyTimestamp":
                    "1629116238",
                    "isAnimated":false
                    /* Sticker 2 */
                    // "url": "https://mmg.whatsapp.net/d/f/Am6FBfNf-E2f1VoGBXkPaNAy7L6Tw_HMavKrHEt48QM4.enc",
                    // "fileSha256": "Yfj8SW7liSEnDakvyVlXVZQ1LJBC9idn09X7KHe8HTc=",
                    // "fileEncSha256": "F854aUrzgAkBTOVULpne4oSIi6S04Jo56pjZEo+p+9U=",
                    // "mediaKey": "Z3nA2asclAAwWHngNO/vJ81qxOE2/0gkEnXak+NxPV4=",
                    // "mimetype": "image/webp",
                    // "height": 64,
                    // "width": 64,
                    // "directPath": "/v/t62.15575-24/12097272_1193895144391295_8973688483514349023_n.enc?ccb=11-4&oh=5a9d7147627a8355569f1a641b9ebee3&oe=60C65E73",
                    // "fileLength": "7186",
                    // "mediaKeyTimestamp": "1622815545",
                    // "isAnimated": false
                    // "url":"https://mmg.whatsapp.net/d/f/ApnnxwWzOWeE7U1nud0Nk4bk5AnCvijxM9pK0bXWA0Tv.enc",
                }
            }
        }
    },
    fToko : (type, teks = defaultTeks, image = miniThumbnail) => {
        return {
            key: keyType[type],
            message: {
                "productMessage": {
                    "product": {
                        "productImage":{
                            "mimetype": "image/jpeg",
                            "jpegThumbnail": image
                        },
                        "title": teks,
                        "surface": 200, 
                        "description": "Hehey This is an Product with very Cool Quality!",
                        "currencyCode": "IDR",
                        "priceAmount1000": "1000000000",
                        "retailerId": "edwindefine",
                        "productImageCount": 1
                    },
                    "businessOwnerJid": `0@s.whatsapp.net`
                }
            }
        }
    },
    fTroli : (type, teks = defaultTeks, image = miniThumbnail) => {
        return {
            key: keyType[type],
            message: {
                orderMessage: {
                    itemCount: 0,
                    status: 200,
                    thumbnail: image,
                    surface: 200, 
                    message: teks, 
                    orderTitle: 'edwindefine', 
                    sellerJid: '0@s.whatsapp.net'
                } 
            } 
        }
    }
}

// module.exports = {fReplyCmd, fakeReply, fMsg, fVn, fImage, fVideo, fToko, fTroli, fGif, fLoc,fLiveLoc, fDoc, fKontak, fInvite, fSticker}