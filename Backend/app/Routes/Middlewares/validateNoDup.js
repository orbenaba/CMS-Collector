// true specifies NOT_MAIL flag
const { INVALID_USERNAME, INVALID_PASSWORD, INVALID_EMAIL } = require('../../../../client/src/Magic/Errors.magic');
const { R_USERNAME, R_PASSWORD, R_EMAIL } = require('../../../../client/src/Magic/Regex.magic');

module.exports = () => {
    return async (req, res, next) => {
        // first validating that we have token from the last middleware
        console.log("[+] res.locals = ", res.locals)
        if (res.locals.unauthorized || res.locals.hasToken === false) {
            return res.status(400).send({ error: 'You must be authorized in order to change details' });
        }

        // Validating the given fields
        let newUsername = req.body.username, newPassword = req.body.password, newEmail = req.body.email;
        if (!newUsername || !newPassword || !newEmail) {
            return res.status(400).send({ error: 'Username, password & email are required fields' });
        }
        if (!newUsername.match(R_USERNAME)) {
            return res.status(400).send({ error: INVALID_USERNAME });
        }

        if (!newPassword.match(R_PASSWORD)) {
            return res.status(400).send({ error: INVALID_PASSWORD });
        }

        if (!newEmail.match(R_EMAIL)) {
            return res.status(400).send({ error: INVALID_EMAIL });
        }
        next()
    }
}