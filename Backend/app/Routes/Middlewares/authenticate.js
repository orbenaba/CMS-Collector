// Authenticate the user with its cookies'
const { UserModel } = require('../../Schemas/User');
const { ACCESS_TOKEN } = require('../../Config/cookies.config');
const { TOKEN_EXPIRED } = require('../../../../client/src/Magic/Errors.magic');
// flag is used to distinguish between a request with cookies or without em
module.exports = (flag = false) => {
    return async (req, res, next) => {
        try {
            let accessToken = req.cookies.jwt_access_token;
            let refreshToken = req.cookies.jwt_refresh_token;
            // If there is no token stored in cookies, the request is unauthorized

            await UserModel.findByTokenOrRefresh(accessToken, refreshToken, (err, user) => {
                // Refresh Token expired or something
                if (err !== null) {
                    if (err.toString() === 'Refresh token expired') {
                        // We need to refresh the access token
                        res.locals.unauthorized = { Unauthorized: TOKEN_EXPIRED };
                    }
                    if (flag) {
                        return res.status(401).send({ error: TOKEN_EXPIRED })
                    }
                    next();
                }
                else {
                    if (!user && !flag) {
                        res.locals.hasToken = false;
                        next();
                    }
                    else {
                        // update the access token cookie
                        res.cookie(ACCESS_TOKEN, user.accessToken);
                        req.accessToken = user.accessToken;
                        req.user = user;
                        res.locals.hasToken = true;
                        next();
                    }
                }
            })
        } catch (err) {
            if (flag) {
                return res.status(400).send({ error: "You are not authenticated :(" })
            }
            res.locals.hasToken = false;
            next();
        }
    }
}