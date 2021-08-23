const fs = require('fs')

const menu = (pushname, prefix, prefixx, sender, timeWita, isPublic) => {
const {ownerNumber, ownerName, botName, mediaUrl} = JSON.parse(fs.readFileSync('./config.json'))

    //*│*⬡ *Prefix : 「 MULTI PREFIX 」*
    //*│*⬡ *Tag     :* @${sender.split('@')[0]}
    //*│*⬡ *Author : ${ownerName}*
    return`*╭─❒* 「 ${botName} 」 
*│*
*│*⬡ *Hallo kak*
*│*⬡ *Nama : ${pushname}*
*│*⬡ *WITA  : ${timeWita}*
*│*⬡ *Prefix : 「 ${prefixx} 」*
*│*⬡ *Bot mode : ${isPublic ? "PUBLIC-MODE" : "SELF-MODE"}*
*└───────────────────*


*╭─❒ OWNER*
*│*⬡ setPrefix *prefix*
*│*⬡ ${prefix}broadcast *teks*
*│*⬡ ${prefix}public
*│*⬡ ${prefix}self
*│*⬡ ${prefix}antidel *aktif/nonaktif* [rusak]
*│*⬡ ${prefix}autoResponse *aktif/nonaktif*
*│*⬡ ${prefix}addCmd *command*
*│*⬡ ${prefix}removeCmd *command*
*│*⬡ ${prefix}saveVn/saveMusic *name*
*│*⬡ ${prefix}saveMedia *name*
*│*⬡ ${prefix}addResponse *key|response*
*│*⬡ ${prefix}delResponse *key*
*│*⬡ ${prefix}listResponse
*│*⬡ ${prefix}getId
*│*⬡ ${prefix}bugGc
*│*
*├❒ FAKE TEST*
*│*⬡ ${prefix}freply *query*
*│*⬡ ${prefix}fakeUrl
*│*⬡ ${prefix}fakeInvite
*│*⬡ ${prefix}fakeLocation
*│*
*├❒ GROUP MENU*
*│*⬡ ${prefix}antilik *aktif/nonaktif*
*│*⬡ ${prefix}add *nomor*
*│*⬡ ${prefix}kick *mention*
*│*⬡ ${prefix}promote *mention*
*│*⬡ ${prefix}demote *mention*
*│*⬡ ${prefix}hidetag *teks*
*│*⬡ ${prefix}stag
*│*⬡ ${prefix}groupPic
*│*⬡ ${prefix}gPic *tag*
*│*⬡ ${prefix}linkGroup
*│*
*├❒ STICKER*_not work_
*│*⬡ ${prefix}sticker
*│*⬡ ${prefix}swm *pack | author*
*│*⬡ ${prefix}take *pack | author*
*│*⬡ ${prefix}toimg
*│*⬡ ${prefix}attp
*│*
*├❒ ANIME*
*│*⬡ ${prefix}wallAnime
*│*
*├❒ QUERY LOCAL MEDIA*
*│*⬡ ${prefix}customVn *query*
*│*⬡ ${prefix}customMusic *query*
*│*⬡ ${prefix}customMedia *query*
*│*
*├❒ CONVERTER*
*│*⬡ ${prefix}imgThumb
*│*
*├❒ DOWNLOADER*
*│*⬡ ${prefix}ytmp4 *link*
*│*⬡ ${prefix}ytmp3 *link*
*│*⬡ ${prefix}ig *link*
*│*⬡ ${prefix}igStory *username*
*│*⬡ ${prefix}tiktok *link*
*│*
*├❒ MORE*
*│*⬡ ${prefix}lmp (list message processed)
*│*⬡ ${prefix}listCmd
*│*⬡ ${prefix}listVn/listMusic
*│*⬡ ${prefix}listFreply
*│*
*╘═══ 《 *By ${ownerName}* 》 ═══*

`

}

module.exports = { menu }
