const fs = require('fs')
const ffmpeg = require('fluent-ffmpeg')
const { exec, spawn } = require("child_process");
const { resolve } = require('path/posix');

const createExif = (pack, author) => {
    const code = [0x00,0x00,0x16,0x00,0x00,0x00]
    const exif = {
        "sticker-pack-id": "com.client.tech",
        "sticker-pack-name": pack, 
        "sticker-pack-publisher": author, 
        "android-app-store-link": "https://play.google.com/store/apps/details?id=com.termux", 
        "ios-app-store-link": "https://itunes.apple.com/app/sticker-maker-studio/id1443326857"
    }
    let len = JSON.stringify(exif).length
    if (len > 256) {
        len = len - 256
        code.unshift(0x01)
    } else {
        code.unshift(0x00)
    }
    if (len < 16) {
        len = len.toString(16)
        len = "0" + len
    } else {
        len = len.toString(16)
    }
    //len = len < 16 ? `0${len.toString(16)}` : len.toString(16)
    const _ = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00]);
    const __ = Buffer.from(len, "hex")
    const ___ = Buffer.from(code)
    const ____ = Buffer.from(JSON.stringify(exif))
    return new Promise(resolve => {
        fs.writeFileSync('./sticker/stickerWm.exif', Buffer.concat([_, __, ___, ____]))
        resolve(`./sticker/stickerWm.exif`)
    })
}

const execSticker = (exif, media) => {
    return new Promise(resolve => {
        const sName = './sticker/stk.webp'
        try {
            ffmpeg(`./${media}`)
                .input(media)
                .on('start', function (cmd) {})
                .on('error', function (err) {
                    console.log(err)
                    fs.unlinkSync(media)
                    resolve(false)
                })
                .on('end', async function () { 
                    exec(`webpmux -set exif ${exif} ${sName} -o ${sName}`, async (err) => {
                        if (err) resolve(false)
                        resolve(sName)
                    })
                })
                .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
                .toFormat('webp')
                .save(sName)
            
        } catch (e) {
            console.log(e)
            fs.unlinkSync(media)
            resolve(false)
        }
    })
}

const execWebp = (exif, media) => {
    return new Promise(resolve => {
        const sName = './sticker/stkWebp.webp'
        try {
            spawn('webpmux', ['-set','exif', exif, media, '-o', sName])
            .on('exit', () => {
                resolve(sName)
            })
        } catch (e) {
            console.log(e)
            fs.unlinkSync(media)
            resolve(false)
        }
    })
}

// const addStickerMetadata = (packname, author) => {	
//     //'edwin🥇\n\n\nWa-Bot🤖\n\nYT : edwindefine▶️'
//     if (!packname) packname = 'edwindefine\n\nwhatsappBot'; 
//     if (!author) author = 'edwin';	
//     author = author.replace(/[^a-zA-Z0-9]/g, '');	
//     let name = 'data1'
//     if (fs.existsSync(`./sticker/${name}.exif`)) return `./sticker/${name}.exif`
//     const json = {	
//         "sticker-pack-name": packname,
//         // "sticker-pack-publisher": author,
//     }
//     const littleEndian = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00])	
//     const bytes = [0x00, 0x00, 0x16, 0x00, 0x00, 0x00]	

//     let len = JSON.stringify(json).length	
//     let last	

//     if (len > 256) {	
//         len = len - 256	
//         bytes.unshift(0x01)	
//     } else {	
//         bytes.unshift(0x00)	
//     }	

//     if (len < 16) {	
//         last = len.toString(16)	
//         last = "0" + len	
//     } else {	
//         last = len.toString(16)	
//     }	

//     const buf2 = Buffer.from(last, "hex")	
//     const buf3 = Buffer.from(bytes)	
//     const buf4 = Buffer.from(JSON.stringify(json))	

//     const buffer = Buffer.concat([littleEndian, buf2, buf3, buf4])	

//     fs.writeFile(`./sticker/${name}.exif`, buffer, (err) => {	
//         return `./sticker/${name}.exif`	
//     })	

// }

module.exports = {createExif, execSticker, execWebp}