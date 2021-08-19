const fs = require('fs')

const menu = (pushname, prefix, sender, timeWita, isPublic) => {
const {ownerNumber, ownerName, mediaUrl} = JSON.parse(fs.readFileSync('./config.json'))

    //*│*⬡ *Prefix : 「 MULTI PREFIX 」*
    //*│*⬡ *Tag     :* @${sender.split('@')[0]}
    //*│*⬡ *Author : ${ownerName}*
    return`*╭─❒* 「 edwindefine Ofc 」 
*│*
*│*⬡ *Hallo kak*
*│*⬡ *Nama : ${pushname}*
*│*⬡ *WITA  : ${timeWita}*
*│*⬡ *Prefix : 「 / 」*
*│*⬡ *Bot mode : ${isPublic ? "PUBLIC-MODE" : "SELF-MODE"}*
*└───────────────────*


*╭─❒ OWNER*
*│*⬡ ${prefix}public
*│*⬡ ${prefix}self
*│*⬡ ${prefix}asc (add sticker command)
*│*⬡ ${prefix}rsc (remove sticker command)
*│*⬡ ${prefix}getId
*│*⬡ ${prefix}bugGc
*│*⬡ ${prefix}saveImg *name*
*│*⬡ ${prefix}imgThumb
*│*
*├❒ STICKER*
*│*⬡ ${prefix}stk
*│*⬡ ${prefix}swm
*│*⬡ ${prefix}take
*│*⬡ ${prefix}toimg
*│*⬡ ${prefix}attp
*│*
*├❒ FAKE TEST*
*│*⬡ ${prefix}freply *query*
*│*⬡ ${prefix}fakeUrl
*│*⬡ ${prefix}fakeInvite
*│*⬡ ${prefix}fakeLocation
*│*
*├❒ ANIME*
*│*⬡ ${prefix}wallanime
*│*
*├❒ MORE*
*│*⬡ ${prefix}lmp (list message processed)
*│*⬡ ${prefix}customPtt *query*
*│*⬡ ${prefix}hidetag *teks*
*│*⬡ ${prefix}gpic *tag*
*│*⬡ ${prefix}stag
*└─────────────────*

`

}

module.exports = { menu }