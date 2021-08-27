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
*│*⬡ ${prefix}setExif *pack|author* [!emoji]
*│*⬡ ${prefix}setImgPrev
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
*├❒ STORAGE*
*│*⬡ ${prefix}sendVn *query*
*│*⬡ ${prefix}sendMusic *query*
*│*⬡ ${prefix}listVn/listMusic
*│*⬡ ${prefix}sendMedia *query*
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
*├❒ STICKER*
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
*│*⬡ ${prefix}tts *bahasa* *teks*
*│*⬡ ${prefix}imgThumb
*│*⬡ ${prefix}toMedia
*│*⬡ ${prefix}tomp3
*│*
*├❒ KERANG MENU*
*│*⬡ ${prefix}apakah *teks*
*│*⬡ ${prefix}kapankah *teks*
*│*⬡ ${prefix}rate *teks*
*│*⬡ ${prefix}jadian *teks*
*│*
*├❒ TEXT MAKER*
*│*⬡ ${prefix}pornhub *teks1|teks2*
*│*⬡ ${prefix}logowolf *teks1|teks2*
*│*⬡ ${prefix}logowolf2 *teks1|teks2*
*│*⬡ ${prefix}naturalLeaves *teks*
*│*⬡ ${prefix}blackpink *teks*
*│*⬡ ${prefix}dropwater *teks*
*│*⬡ ${prefix}christmas *teks*
*│*⬡ ${prefix}3dgradient *teks*
*│*⬡ ${prefix}shadow *teks*
*│*⬡ ${prefix}romantic *teks*
*│*⬡ ${prefix}smoke *teks*
*│*⬡ ${prefix}naruto *teks*
*│*⬡ ${prefix}love *teks*
*│*⬡ ${prefix}underGrass *teks*
*│*⬡ ${prefix}doubleHeart *teks*
*│*⬡ ${prefix}butterfly *teks*
*│*⬡ ${prefix}coffeCup *teks*
*│*
*├❒ SEARCH*
*│*⬡ ${prefix}igstalk *username*
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
