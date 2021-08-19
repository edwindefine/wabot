const axios = require('axios')
const spin = require('spinnies')

const getBuffer = async (url, options) => {
    try {
        options ? options : {}
        const res = await axios({
            method: "get",
            url,
            headers: {
                'DNT': 1,
                'Upgrade-Insecure-Request': 1
            },
            ...options,
            responseType: 'arraybuffer'
        })
        return res.data
    } catch (e) {
        console.log(`Error : ${e}`)
    }
}

const spinner = { 
    "interval": 120,
    "frames": [
                                             "🕢",
                                          "🕡",
                                       "🕠",
                                    "🕟",
                                "🕞",
                            "🕝",
                        "🕕",
                    "🕔",
                 "🕓",
              "🕒",
          "🕑",
      "🕐"
    ]}

let globalSpinner;


const getGlobalSpinner = (disableSpins = false) => {
    if(!globalSpinner) globalSpinner = new spin({ color: 'blue', succeedColor: 'green', spinner, disableSpins});
    return globalSpinner;
}

spins = getGlobalSpinner(false)

const start = (id, text) => {
    spins.add(id, {text: text})
        /*setTimeout(() => {
            spins.succeed('load-spin', {text: 'Suksess'})
        }, Number(wait) * 1000)*/
}
const info = (id, text) => {
    spins.update(id, {text: text})
}
const success = (id, text) => {
    spins.succeed(id, {text: text})
}
const close = (id, text) => {
    spins.fail(id, {text: text})
}

const getGroupAdmins = (participants) => {
	admins = []
	for (let i of participants) {
		i.isAdmin ? admins.push(i.jid) : ''
	}
	return admins
}


const getGroupMembersId = (groupMembers) => {
    membersId = []
    for (let i of groupMembers){
        membersId.push(i.jid)
    }
    return membersId
}

module.exports = { getBuffer, start, info, success, close, getGroupAdmins, getGroupMembersId }