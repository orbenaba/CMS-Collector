// true specifies NOT_MAIL flag
const { INVALID_USERNAME, INVALID_PASSWORD, INVALID_EMAIL } = require('../../../../client/src/Magic/Errors.magic');
const { R_USERNAME, R_PASSWORD, R_EMAIL } = require('../../../../client/src/Magic/Regex.magic');
const IsCommonPassword = require('../../Help-Functions/CheckIfPasswordInList');
// flag specifices With out mail 
module.exports = (flag = false) => {
    return async (req, res, next) => {
        // If the token sent within the request so there is no point to validate username | password | email
        if (res.locals.hasToken === true) {
            next();
        }
        else {
            let username = req.body.username, password = req.body.password, email = req.body.email;
            if (!username || !password || (!email && flag === false)) {
                if (!res.locals.unauthorized) {
                    return res.status(401).send(res.locals.unauthorized);
                }
                return res.status(400).send({ error: flag ? 'Username & password are required fields' : 'Username, password & email are required fields' });
            }
            const isWeek = await IsCommonPassword(password)
            if (isWeek) {
                return res.status(400).send({ error: "Too week password; Some dictionary attack might be happened :(" })
            }
            if (!username.match(R_USERNAME)) {
                return res.status(400).send({ error: INVALID_USERNAME });
            }

            if (!password.match(R_PASSWORD)) {
                return res.status(400).send({ error: INVALID_PASSWORD });
            }
            // /\S+@\S+\.\S+/
            // \S means everything that is not whitespace-> \s
            // .(dot) is a special character so we need to escape it with backslash -> \.
            if (flag === false && !email.match(R_EMAIL)) {
                return res.status(400).send({ error: INVALID_EMAIL });
            }
            next();
        }
    }
}