const fs = require('fs')

const menu = (pushname, prefix, prefixx, sender, timeWita, isPublic) => {
const shape = '⬡'
const {ownerNumber, ownerName, botName, mediaUrl} = JSON.parse(fs.readFileSync('./config.json'))

    //*│*${shape} *Prefix : 「 MULTI PREFIX 」*
    //*│*${shape} *Tag     :* @${sender.split('@')[0]}
    //*│*${shape} *Author : ${ownerName}*
    return`*╭─❒* 「 ${botName} 」 
*│*
*│*${shape} *Hallo kak*
*│*${shape} *Nama : ${pushname}*
*│*${shape} *WITA  : ${timeWita}*
*│*${shape} *Prefix : 「 ${prefixx} 」*
*│*${shape} *Bot mode : ${isPublic ? "PUBLIC-MODE" : "SELF-MODE"}*
*└───────────────────*

*╭─❒ OWNER*
*│*${shape} setPrefix *prefix*
*│*${shape} ${prefix}broadcast *teks*
*│*${shape} ${prefix}public
*│*${shape} ${prefix}self
*│*${shape} ${prefix}setExif *pack|author* [!emoji]
*│*${shape} ${prefix}setPrevImg
*│*${shape} ${prefix}setFakeImg
*│*${shape} ${prefix}removebanchat *groupId*
*│*${shape} ${prefix}antidel *aktif/nonaktif* [rusak]
*│*${shape} ${prefix}autoResponse *aktif/nonaktif*
*│*${shape} ${prefix}addCmd *command*
*│*${shape} ${prefix}removeCmd *command*
*│*${shape} ${prefix}listCmd
*│*${shape} ${prefix}saveVn/saveMusic *name*
*│*${shape} ${prefix}saveMedia *name*
*│*${shape} ${prefix}addResponse *key|response*
*│*${shape} ${prefix}delResponse *key*
*│*${shape} ${prefix}listResponse
*│*${shape} ${prefix}getId
*│*${shape} ${prefix}imgbb
*│*${shape} ${prefix}bugGc
*│*
*├❒ FAKE TEST*
*│*${shape} ${prefix}freply *query*
*│*${shape} ${prefix}listFreply
*│*${shape} ${prefix}fakeUrl
*│*${shape} ${prefix}fakeInvite
*│*${shape} ${prefix}fakeLocation
*│*
*├❒ STORAGE*
*│*${shape} ${prefix}sendVn *query*
*│*${shape} ${prefix}sendMusic *query*
*│*${shape} ${prefix}listVn/listMusic
*│*${shape} ${prefix}sendMedia *query*
*│*${shape} ${prefix}listMedia
*│*
*├❒ GROUP MENU*
*│*${shape} ${prefix}antilik *aktif/nonaktif*
*│*${shape} ${prefix}add *nomor*
*│*${shape} ${prefix}kick *mention*
*│*${shape} ${prefix}promote *mention*
*│*${shape} ${prefix}demote *mention*
*│*${shape} ${prefix}banchat *aktif/nonaktif*
*│*${shape} ${prefix}listBanchat
*│*${shape} ${prefix}linkGroup
*│*${shape} ${prefix}join *linkGroup*
*│*${shape} ${prefix}hidetag *teks*
*│*${shape} ${prefix}stag
*│*${shape} ${prefix}groupPic
*│*${shape} ${prefix}gPic *tag*
*│*
*├❒ STICKER*
*│*${shape} ${prefix}sticker
*│*${shape} ${prefix}swm *pack | author*
*│*${shape} ${prefix}take *pack | author*
*│*${shape} ${prefix}attp
*│*
*├❒ CONVERTER*
*│*${shape} ${prefix}nulis *teks*
*│*${shape} ${prefix}tts *bahasa* *teks*
*│*${shape} ${prefix}toMedia
*│*${shape} ${prefix}toMp3
*│*${shape} ${prefix}imgThumb
*│*
*├❒ ANIME*
*│*${shape} ${prefix}chara *query*
*│*${shape} ${prefix}wallAnime
*│*${shape} ${prefix}neko
*│*${shape} ${prefix}waifu
*│*${shape} ${prefix}avatar
*│*${shape} ${prefix}holo
*│*${shape} ${prefix}gecg
*│*
*├❒ ANIME LINK*
*│*${shape} ${prefix}smug
*│*${shape} ${prefix}hug
*│*${shape} ${prefix}slap
*│*${shape} ${prefix}feed
*│*${shape} ${prefix}poke
*│*${shape} ${prefix}pat
*│*${shape} ${prefix}tickle
*│*${shape} ${prefix}cuddle
*│*
*├❒ NSWF(18+)*
*│*${shape} ${prefix}hentai
*│*${shape} ${prefix}yuri
*│*${shape} ${prefix}cum
*│*${shape} ${prefix}solo
*│*${shape} ${prefix}boobs
*│*${shape} ${prefix}anal
*│*${shape} ${prefix}hololewd
*│*${shape} ${prefix}lewd
*│*
*├❒ KERANG MENU*
*│*${shape} ${prefix}apakah *teks*
*│*${shape} ${prefix}kapankah *teks*
*│*${shape} ${prefix}rate *teks*
*│*${shape} ${prefix}jadian *teks*
*│*
*├❒ TEXT MAKER*
*│*${shape} ${prefix}pornhub *teks1|teks2*
*│*${shape} ${prefix}logowolf *teks1|teks2*
*│*${shape} ${prefix}logowolf2 *teks1|teks2*
*│*${shape} ${prefix}naturalLeaves *teks*
*│*${shape} ${prefix}blackpink *teks*
*│*${shape} ${prefix}dropwater *teks*
*│*${shape} ${prefix}christmas *teks*
*│*${shape} ${prefix}3dgradient *teks*
*│*${shape} ${prefix}shadow *teks*
*│*${shape} ${prefix}romantic *teks*
*│*${shape} ${prefix}smoke *teks*
*│*${shape} ${prefix}naruto *teks*
*│*${shape} ${prefix}love *teks*
*│*${shape} ${prefix}underGrass *teks*
*│*${shape} ${prefix}doubleHeart *teks*
*│*${shape} ${prefix}butterfly *teks*
*│*${shape} ${prefix}coffeCup *teks*
*│*
*├❒ SEARCH*
*│*${shape} ${prefix}igstalk *username*
*│*
*├❒ DOWNLOADER*
*│*${shape} ${prefix}ytmp4 *link*
*│*${shape} ${prefix}ytmp3 *link*
*│*${shape} ${prefix}ig *link*
*│*${shape} ${prefix}igStory *username*
*│*${shape} ${prefix}tiktok *link*
*│*${shape} ${prefix}pinterest *query*
*│*
*├❒ MORE*
*│*${shape} ${prefix}lmp (list message processed)
*│*
*╘═══ 《 *By ${ownerName}* 》 ═══*

`

}

module.exports = { menu }
