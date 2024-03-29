
// Node Modules
const nodemailer = require('nodemailer');
const config = require("config");
const jwt = require('jsonwebtoken');

// Custom Modules

const { UserModel, CreateToken: createToken } = require('../Schemas/user.schemas');
const validateEmail = require('../Routes/Middlewares/validateEmail')


// constants
const ACCESS_TOKEN = config.get("ACCESS_TOKEN");
const REFRESH_TOKEN = config.get("REFRESH_TOKEN");
const ACCESS_TOKEN_LIFE = config.get("ACCESS_TOKEN_LIFE");
const ACCESS_TOKEN_SECRET = config.get("ACCESS_TOKEN_SECRET");

// Gernerals
const { BadRequest, ServerError, Success, ClearAllCookies } = require("../Helpers/generals.helpers");
const { isTokenInBlacklist, invalidateToken } = require('../Routes/Middlewares/validateEmailToken');

var transporter = process.env.NODE_ENV === 'production' ? nodemailer.createTransport({
    service: 'gmail',
    // host: "out.walla.co.il",
    // secure: true,
    // requireTLS: true,
    // port: 587,
    auth: {
        user: "team5risk@gmail.com",
        pass: "TRK12345!"
    }
}) :
    nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "505480d644e0be",
            pass: "f925ef540e3699"
        }
    });



async function signup(req, res) {
    try {
        const username = req.body.username, password_hash = req.body.password, email = req.body.email;
        const user = new UserModel({ username, email, password_hash });
        await user.save();
        // Secure enforcing that the cookies are sent only over https and not over http
        res.cookie(ACCESS_TOKEN, user.accessToken, { /*secure: true,*/ httpOnly: false })
        res.cookie(REFRESH_TOKEN, user.refreshToken, { /*secure: true,*/ httpOnly: true })
        return Success(res, { user });
    } catch (error) {
        // If the error is thrown as a result of "username/email is already taken" we sanitize the error to the client side
        if (error.message) {
            return BadRequest(res, error.message);
        }
        else {
            return ServerError(res, error);
        }
    }
}
//If the email is exists, a link to reset password will be sent to the user email 
async function forgotPassword(req, res) {
    const email = req.body.email
    const user = await validateEmail(email)

    if (!user) {
        res.sendStatus(403)
        return
    }

    const token = createToken({ email }, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE * 3)
    console.log("token: ", token)

    const link = `${process.env.NODE_ENV === 'production' ? "https://vast-basin-88117.herokuapp.com/" : "http://localhost:3000/"}reset-password?token=${token}`

    var mailOptions = {
        from: 'f204cfe131-8eef21@inbox.mailtrap.io',
        to: email,
        subject: 'Forget Password',
        text: link
    };

    try {
        const info = transporter.sendMail(mailOptions);
    }
    catch (err) {
        res.sendStatus(405)
    }
    res.sendStatus(200)
}

async function resetPassword(req, res) {
    const { password, token } = req.body
    jwt.verify(token, ACCESS_TOKEN_SECRET, async (err, decode) => {
        if (err || isTokenInBlacklist(token)) {
            return ServerError(res, err)
        }
        else {
            const email = decode.email
            try {
                const user = await UserModel.changePassword(password, email)
                invalidateToken(token)
                return Success(res, { user })
            } catch (err) {
                return ServerError(res, err)
            }
        }
    })
}


async function login(req, res) {
    try {
        if (res.locals.hasToken) {
            // Login wih {refresh & access tokens}
            return Success(res, { user: req.body.user });
        }
        else {
            // Login with {username & password}
            const username = req.body.username, password = req.body.password;
            const userM = await UserModel.login(username, password);
            await userM.save();
            const user = userM.toObject();
            // Returning the new token to the user after its login
            // secure - Only over https
            // httpOnly - cannot access the cookie via the DOM (a CSRF mitigation)
            res.cookie(ACCESS_TOKEN, user.accessToken, { httpOnly: false });
            res.cookie(REFRESH_TOKEN, user.refreshToken, { /*secure: true,*/ httpOnly: true });
            return Success(res, { user });
        }
    } catch (error) {
        return ServerError(res, error);
    }
}


async function deleteUser(req, res) {
    try {
        if (res.locals.hasToken) {
            await UserModel.deleteUserByUsername(res.locals.user.username);
            await ClearAllCookies(res);
            return Success(res, { success: "Success in deleting user account" })
        }
        else {
            return BadRequest(res, "No cookies specified")
        }
    } catch (error) {
        return ServerError(res, error);
    }
}

async function logout(req, res) {
    try {
        // Clear the cookies before log out
        await ClearAllCookies(res);
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        return ServerError(res, error);
    }
}

async function changeDetails(req, res) {
    try {
        if (!res.locals.unauthorizedWithResponse) {
            let oldUserDetails = req.body.user;
            let newUsername = req.body.username, newPassword = req.body.password, newEmail = req.body.email;
            // newUsername, newPassword, newEmail have already been validated
            const user = await UserModel.changeDetails(oldUserDetails, newUsername, newPassword, newEmail)
            // Setting the new cookies
            res.cookie(ACCESS_TOKEN, user.accessToken, { httpOnly: false });
            res.cookie(REFRESH_TOKEN, user.refreshToken, { /*secure: true,*/ httpOnly: true });
            await user.save();
            return Success(res, { user })
        }
    } catch (error) {
        return ServerError(res, error)
    }
}

module.exports = { signup, deleteUser, login, logout, changeDetails, forgotPassword, resetPassword };