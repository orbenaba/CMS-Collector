// true specifies NOT_MAIL flag
const { INVALID_USERNAME, INVALID_PASSWORD, INVALID_EMAIL } = require('../../../client/src/Magic/Errors.magic');
const { R_USERNAME, R_PASSWORD, R_EMAIL } = require('../../../client/src/Magic/Regex.magic');
const { BadRequest, Unauthorized } = require('../../Helpers/generals.helpers');

module.exports = () => { 
    return async (req, res, next) => {
        if(!res.locals.unauthorizedWithResponse) {
            // first validating that we have token from the last middleware
            if (res.locals.unauthorized || res.locals.hasToken === false) {
                return Unauthorized(res, 'You must be authorized in order to change details');
            }

            // Validating the given fields
            let newUsername = req.body.username, newPassword = req.body.password, newEmail = req.body.email;
            // Not all the fields are required, but if given we'll check for it
            if (newUsername && !newUsername.match(R_USERNAME)) {
                return BadRequest(res, INVALID_USERNAME);
            }

            if (newPassword && !newPassword.match(R_PASSWORD)) {
                return BadRequest(res, INVALID_PASSWORD);
            }

            if (newEmail && !newEmail.match(R_EMAIL)) {
                return BadRequest(res, INVALID_EMAIL);
            }
        }
        next()
    }
}