
// Node Modules
const nodemailer = require('nodemailer');
const config = require("config");
const jwt = require('jsonwebtoken');

// Custom Modules

const { UserModel } = require('../Schemas/user.schemas');
const { saveToken, useToken, validateEmail } = require('../Helpers/ValidToken');

// constants
const ACCESS_TOKEN = config.get("ACCESS_TOKEN");
const REFRESH_TOKEN = config.get("REFRESH_TOKEN");

// Gernerals
const { BadRequest, ServerError, Success, ClearAllCookies } = require("../Helpers/generals.helpers");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: config.get("EMAIL_AUTH")
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
    saveToken(token, email)
    const link = `http://localhost:3000/reset-password?token=${token}`

    var mailOptions = {
        from: 'team5risk@gmail.com',
        to: email,
        subject: 'Forget Password',
        text: link
    };

    try {
        const info = transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    }
    catch (err) {
        console.log(err);
        res.sendStatus(405)
    }
    res.sendStatus(200)
    //console.log(validEmail, email, token)

}

async function resetPassword(req, res) {
    const { password, token } = req.body
    console.log(password)
    jwt.verify(token, ACCESS_TOKEN_SECRET, async (err, decode) => {
        if (err) {
            console.log(JSON.stringify(err))
            return ServerError(res, error)
        }
        else {
            const email = decode.email
            try {
                console.log("in reset-password: ", email)
                const user = await UserModel.changePassword(password, email)
                console.log("[+] reset password:\n", user)
                return Success(res, { user })
            } catch (err) {
                console.log(JSON.stringify(err))
                return ServerError(res, error)
            }
        }
    })
}


async function login(req, res) {
    try {
        if (res.locals.hasToken) {
            // Login wih {refresh & access tokens}
            return Success(res, { user: req.user });
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
        return Success(res, { message: "Cookies were deleted in success" });
    } catch (error) {
        return ServerError(res, error);
    }
}

async function changeDetails(req, res) {
    try {
        if(!res.locals.unauthorizedWithResponse) {
            let oldUserDetails = req.user;
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