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
*│*⬡ ${prefix}antidel *aktif/nonaktif*
*│*⬡ ${prefix}asc (add sticker command)
*│*⬡ ${prefix}rsc (remove sticker command)
*│*⬡ ${prefix}getId
*│*⬡ ${prefix}bugGc
*│*⬡ ${prefix}saveImg *name*
*│*
*├❒ GROUP MENU*
*│*⬡ ${prefix}antilik *aktif/nonaktif*
*│*⬡ ${prefix}add *nomor*
*│*⬡ ${prefix}kick *mention*
*│*⬡ ${prefix}promote *mention*
*│*⬡ ${prefix}demote *mention*
*│*⬡ ${prefix}hidetag *teks*
*│*⬡ ${prefix}stag
*│*⬡ ${prefix}gpic *tag*
*│*⬡ ${prefix}linkgroup
*│*
*├❒ FAKE TEST*
*│*⬡ ${prefix}freply *query*
*│*⬡ ${prefix}fakeUrl
*│*⬡ ${prefix}fakeInvite
*│*⬡ ${prefix}fakeLocation
*│*
*├❒ STICKER*
*│*⬡ ${prefix}sticker
*│*⬡ ${prefix}swm *pack | author*
*│*⬡ ${prefix}take *pack | author*
*│*⬡ ${prefix}toimg
*│*⬡ ${prefix}attp
*│*
*├❒ ANIME*
*│*⬡ ${prefix}wallanime
*│*
*├❒ MORE*
*│*⬡ ${prefix}lmp (list message processed)
*│*⬡ ${prefix}customPtt *query*
*│*⬡ ${prefix}imgThumb
*└─────────────────*

`

}

module.exports = { menu }