const { UserModel, createToken } = require('../Schemas/User');
const { ACCESS_TOKEN, REFRESH_TOKEN } = require('../Config/cookies.config');
const validateEmail = require('../Routes/Middlewares/validateEmail');
const nodemailer = require('nodemailer');
const { saveToken, useToken } = require('../Microservices/ValidToken');
const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE } = require('../Config');
const jwt = require('jsonwebtoken');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'team5risk@gmail.com',
        pass: 'TRK12345!'
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
        res.status(200).send({ user });
    } catch (error) {
        // If the error is thrown as a result of "username/email is already taken" we sanitize the error to the client side
        if (typeof error.message !== 'undefined') {
            return res.status(400).send({ error: error.message });
        }
        else {
            return res.status(400).send({ error });
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
            return res.status(403).send({ err })
        }
        else {
            const email = decode.email
            try {
                console.log("in reset-password: ", email)
                const user = await UserModel.changePassword(password, email)
                console.log("[+] reset password:\n", user)
                return res.status(200).send({ user })
            } catch (err) {
                console.log(JSON.stringify(err))
                return res.status(404).send({ err })
            }
        }
    })

}




// After login, we renewing the tokens
async function login(req, res) {
    try {
        // If the token sent within the request so there is no point to login again
        if (res.locals.hasToken) {
            res.status(200).send({ user: req.user });
        }
        else {
            const username = req.body.username, password = req.body.password;
            const user = await UserModel.login(username, password);
            // Returning the new token to the user after its login
            // secure - Only over https
            // httpOnly - cannot access the cookie via the DOM (a CSRF mitigation)
            res.cookie(ACCESS_TOKEN, user.accessToken, { httpOnly: false });
            res.cookie(REFRESH_TOKEN, user.refreshToken, { /*secure: true,*/ httpOnly: true });
            res.status(200).send({ user });
        }
    } catch (error) {
        return res.status(400).send({ error });
    }
}


async function deleteUser(req, res) {
    try {
        if (res.locals.hasToken) {
            await UserModel.deleteUserByUsername(res.locals.user.username);
            res.clearCookie(ACCESS_TOKEN);
            res.clearCookie(REFRESH_TOKEN);
            return res.status(200).send({ success: "Success in deleting user account" })
        }
        else {
            throw "No cookies specified"
        }
    } catch (error) {
        return res.status(400).send({ error });
    }
}

async function logout(req, res) {
    try {
        // Clear the cookies before log out
        res.clearCookie(ACCESS_TOKEN);
        res.clearCookie(REFRESH_TOKEN);
        return res.status(200).send({ message: "Cookies were deleted in success" });
    } catch (error) {
        return res.status(400).send({ error })
    }
}

async function changeDetails(req, res) {
    try {
        let oldUserDetails = req.user;
        let newUsername = req.body.username, newPassword = req.body.password, newEmail = req.body.email
        // newUsername, newPassword, newEmail are already been validated
        const user = await UserModel.changeDetails(oldUserDetails, newUsername, newPassword, newEmail)
        await user.save();
        console.log("[+] change user:\n", user)
        return res.status(200).send({ user })
    } catch (err) {
        console.log(JSON.stringify(err))
        return res.status(406).send({ err })
    }
}

module.exports = { signup, deleteUser, login, logout, changeDetails, forgotPassword, resetPassword };