const tokenCache = {}
const VALID = "valid"
const INVALID = "invalid"
function saveToken(token, email) {
    tokenCache[email] = { token, "status": VALID }
    setTimeout(() => {
        tokenCache[email].status = INVALID
    }, 300000)//60000 is a min, need to be 5 min change it later
}

function validToken(token, email) {
    const cacheObj = tokenCache[email]
    if (cacheObj && token === cacheObj.token && cacheObj.status === VALID) {
        return true
    }
    else {
        return false
    }
}


function useToken(token, email) {
    const cacheObj = tokenCache[email]
    if (cacheObj && token === cacheObj.token) {
        delete tokenCache[email]
    }
}

module.exports = { saveToken, validToken, useToken }