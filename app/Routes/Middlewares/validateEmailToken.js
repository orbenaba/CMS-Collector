
const { BadRequest } = require('../../Helpers/generals.helpers')
const jwt = require('jsonwebtoken');
const config = require("config")
const ACCESS_TOKEN_SECRET = config.get("ACCESS_TOKEN_SECRET");

const invalidateTokens = {}

function invalidateToken(token) {
    invalidateTokens[token] = true
}

function isTokenInBlacklist(token) {
    return !!invalidateTokens[token]
}

function validateEmailToken(req, res, next) {
    const token = req.body.token

    jwt.verify(token, ACCESS_TOKEN_SECRET, async (err, decode) => {
        if (err || isTokenInBlacklist(token)) {
            console.log(JSON.stringify(err))
            return BadRequest(res, "Invalid token");
        }
        else {
            next()
        }
    })

}


module.exports = { validateEmailToken, isTokenInBlacklist, invalidateToken }