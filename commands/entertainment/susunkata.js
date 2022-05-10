const { fetchUrl } = require("../../lib/Function")

let timeout = 120000
let poin = 4999

module.exports = {
    name: "susunkata",
    alias: ["skata"],
    desc: "Entertaiment Fiture Susun Kata",
    type: "entertainment",
    start: async(hisoka, m) => {
        let game = global.db.game.susunkata
        let id = "game_" + m.from
        if (id in game) {
            hisoka.sendMessage(m.from, "There are still unfinished Susun Kata sessions", { quoted: game[id][0] })
            throw false
        }
        let res = await fetchUrl(global.api("zenz", "/api/susunkata", {}, "apikey"))
        let json = await res.result
        let caption = `
*Question :* ${json.soal}
*Type :* ${json.tipe}

Timeout *${(timeout / 1000).toFixed(2)} second(s)*
        `.trim()
        game[id] = [
            await m.reply(caption),
            json, poin,
            setTimeout(async () => {
                if (game[id]) await m.reply(`Time has run out!\nthe answer is *${json.jawaban}*`)
                delete game[id]
            }, timeout)
        ]
    }
}