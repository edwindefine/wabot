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
*│*⬡ ${prefix}autoResponse *aktif/nonaktif*
*│*⬡ ${prefix}addCmd *command*
*│*⬡ ${prefix}removeCmd *command*
*│*⬡ ${prefix}addVn *name*
*│*⬡ ${prefix}addResponse *key|response*
*│*⬡ ${prefix}delResponse *key*
*│*⬡ ${prefix}listResponse
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
*│*⬡ ${prefix}linkGroup
*│*
*├❒ FAKE TEST*
*│*⬡ ${prefix}freply *query*
*│*⬡ ${prefix}listFreply
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
*│*⬡ ${prefix}wallAnime
*│*
*├❒ AUDIO PROCESSED*
*│*⬡ ${prefix}customVn *query*
*│*⬡ ${prefix}listVn
*│*
*├❒ CONVERTER*
*│*⬡ ${prefix}imgThumb
*│*
*├❒ DOWNLOADER*
*│*⬡ ${prefix}ytmp4 *link*
*│*
*├❒ MORE*
*│*⬡ ${prefix}lmp (list message processed)
*│*⬡ ${prefix}listCmd
*└─────────────────*

`

}

module.exports = { menu }