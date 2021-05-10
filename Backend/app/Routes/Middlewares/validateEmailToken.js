
const { BadRequest } = require('../../Helpers/generals.helpers')
const { ACCESS_TOKEN_SECRET } = require('../../Config')
const jwt = require('jsonwebtoken');
const { validToken } = require('../../Microservices/ValidToken')
function validateEmailToken(req, res, next) {
    const token = req.body.token
    jwt.verify(token, ACCESS_TOKEN_SECRET, async (err, decode) => {
        if (err) {
            console.log(JSON.stringify(err))
            return BadRequest(res, "Invalid token");
                }
        else {
            const email = decode.email
            const tokenIsValid = validToken(token, email)
            if (!tokenIsValid) {
                return BadRequest(res, "Invalid token");
            }
            next()
        }
    })

}


module.exports = { validateEmailToken }