
const pttCmd = ['ngen', 'haa', 'mou', 'ara', 'kana', 'mgl', 'trig', 'mask', 'rude', '24kgoldn', 'yamete', 'shop', 'campion', 'beggin', 'lemont', 'mencarialasan']

const pttCustom = (title) => {
    const pttPath = ['ngen.mp3', 'haa.mp3', 'moualready.mp3', 'ara-ara.mp3', 'KANA-BOON - Silhouette.mp3', 'Megalovania - Undertale.mp3',
                'Triggered Sound Effect.mp3', 'Future - Mask Off (Aesthetic Remix).mp3', 'RUDE - Eternal Youth.mp3', '24kGoldn - Mood (Lyrics) ft. Iann DiorWhy you always in a mood.mp3',
                'asus-yamete-kudasai.mp3', 'Undertale OST - Shop Extended.mp3', 'Queen - We Are The Champions Lyrics.mp3', "Måneskin - Beggin' (8D AUDIO).mp3", 'Lemon Tree - Fools Garden (Lyrics).mp3', 
                'Mencari Alasan Versi HIP HOP.mp3']

    for(let i = 0; i<pttCmd.length; i++){
        if(title === pttCmd[i].toLowerCase()){
            return `./assets/audio/${pttPath[i]}`
        }
    }
    return false

}

module.exports = {pttCmd, pttCustom}