const fs = require('fs')

/**
 * Add Response message to database
 * @param {String} msg
 * @param {Sstring} response
 * @param {String} userId
 * @param {Object} data
 * @returns true
 */
const addResponse = (msg, response, userId, _data) => {
    const obj = {
        pesan: msg,
        balasan: response,
        creator: userId
    }
    _data.push(obj)
    fs.writeFileSync('./database/response.json', JSON.stringify(_data))

    return true
}


/**
 * Delete Response from database
 * @param {String} response
 * @param {Object} _data
 */
const deleteResponse = (response, _data) => {
    Object.keys(_data).forEach((i) => {
        if (_data[i].pesan === response) {
            _data.splice(i, 1)
            fs.writeFileSync('./database/response.json', JSON.stringify(_data))
        }
    })
    return true
}


/**
 * Check response is available or not
 * @param {String} response
 * @param {Object} _data
 * @returns {Boolean}
 */

const checkResponse = (response, _data) => {
    let status = false
    Object.keys(_data).forEach((i) => {
        if (_data[i].pesan === response) {
            status = true
        }
    })

    return status
}



module.exports = {
    addResponse,
    checkResponse,
    deleteResponse
}