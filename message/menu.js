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
*│*⬡ ${prefix}removebanchat *groupId*
*│*⬡ ${prefix}antidel *aktif/nonaktif* [rusak]
*│*⬡ ${prefix}autoResponse *aktif/nonaktif*
*│*⬡ ${prefix}addCmd *command*
*│*⬡ ${prefix}removeCmd *command*
*│*⬡ ${prefix}listCmd
*│*⬡ ${prefix}saveVn/saveMusic *name*
*│*⬡ ${prefix}saveMedia *name*
*│*⬡ ${prefix}addResponse *key|response*
*│*⬡ ${prefix}delResponse *key*
*│*⬡ ${prefix}listResponse
*│*⬡ ${prefix}getId
*│*⬡ ${prefix}imgbb
*│*⬡ ${prefix}bugGc
*│*
*├❒ FAKE TEST*
*│*⬡ ${prefix}freply *query*
*│*⬡ ${prefix}listFreply
*│*⬡ ${prefix}fakeUrl
*│*⬡ ${prefix}fakeInvite
*│*⬡ ${prefix}fakeLocation
*│*
*├❒ QUERY LOCAL MEDIA*
*│*⬡ ${prefix}customVn *query*
*│*⬡ ${prefix}customMusic *query*
*│*⬡ ${prefix}listVn/listMusic
*│*⬡ ${prefix}customMedia *query*
*│*⬡ ${prefix}listMedia
*│*
*├❒ GROUP MENU*
*│*⬡ ${prefix}antilik *aktif/nonaktif*
*│*⬡ ${prefix}add *nomor*
*│*⬡ ${prefix}kick *mention*
*│*⬡ ${prefix}promote *mention*
*│*⬡ ${prefix}demote *mention*
*│*⬡ ${prefix}banchat *aktif/nonaktif*
*│*⬡ ${prefix}listBanchat
*│*⬡ ${prefix}linkGroup
*│*⬡ ${prefix}join *linkGroup*
*│*⬡ ${prefix}hidetag *teks*
*│*⬡ ${prefix}stag
*│*⬡ ${prefix}groupPic
*│*⬡ ${prefix}gPic *tag*
*│*
*├❒ STICKER*_not work_
*│*⬡ ${prefix}sticker
*│*⬡ ${prefix}swm *pack | author*
*│*⬡ ${prefix}take *pack | author*
*│*⬡ ${prefix}attp
*│*
*├❒ ANIME*
*│*⬡ ${prefix}wallAnime
*│*⬡ ${prefix}chara
*│*
*├❒ CONVERTER*
*│*⬡ ${prefix}nulis *teks*
*│*⬡ ${prefix}imgThumb
*│*⬡ ${prefix}toMedia
*│*⬡ ${prefix}tomp3
*│*
*├❒ TEXT MAKER*
*│*⬡ ${prefix}pornhub *teks1|teks2*
*│*
*├❒ DOWNLOADER*
*│*⬡ ${prefix}ytmp4 *link*
*│*⬡ ${prefix}ytmp3 *link*
*│*⬡ ${prefix}ig *link*
*│*⬡ ${prefix}igStory *username*
*│*⬡ ${prefix}tiktok *link*
*│*⬡ ${prefix}pinterest *query*
*│*
*├❒ MORE*
*│*⬡ ${prefix}lmp (list message processed)
*│*
*╘═══ 《 *By ${ownerName}* 》 ═══*

`

}

module.exports = { menu }
