const { BadRequest } = require('../../Helpers/generals.helpers')
const { validToken } = require('../../Helpers/ValidToken')
function validateEmailToken(req, res, next) {
    const email = req.body.email
    const token = req.body.token
    const tokenIsValid = validToken(token, email)
    if (!tokenIsValid) {
        return BadRequest(res, "Invalid token");
    }
    next()
}

module.exports = { validateEmailToken }