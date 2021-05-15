// Node Modules
const config = require("config");

// Authenticate the user with its cookies'
const { UserModel } = require('../../Schemas/user.schemas');
const { TOKEN_EXPIRED } = require('../../../../client/src/Magic/Errors.magic');
const { Unauthorized } = require("../../Helpers/generals.helpers");

// constants
const ACCESS_TOKEN = config.get("ACCESS_TOKEN");
// flag is used to distinguish between a request with cookies or without em
module.exports = (flag = false) => {
    return async (req, res, next) => {
        try {
            let accessToken = req.cookies[config.get("ACCESS_TOKEN")];
            let refreshToken = req.cookies[config.get("REFRESH_TOKEN")];
            // If there is no token stored in cookies, the request is unauthorized
            await UserModel.findByTokenOrRefresh(accessToken, refreshToken, (err, user) => {
                // Refresh Token expired or something
                if (err !== null) {
                    if (err.toString() === 'Refresh token expired') {
                        // We need to refresh the access token
                        res.locals.unauthorized = { Unauthorized: TOKEN_EXPIRED };
                    }
                    if (flag) {
                        return Unauthorized(res, err)
                    }
                }
                else {
                    if (!user && !flag) {
                        res.locals.hasToken = false;
                    }
                    else {
                        // update the access token cookie
                        res.cookie(ACCESS_TOKEN, user.accessToken);
                        req.accessToken = user.accessToken;
                        req.user = user;
                        res.locals.hasToken = true;
                    }
                }
            })
        } catch (err) {
            if (flag) {
                return Unauthorized(res, "You are not authenticated :(")
            }
            res.locals.hasToken = false;
        }
        finally {
            next();
        }
    }
}