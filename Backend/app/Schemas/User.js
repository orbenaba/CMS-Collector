const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
// We need a secret to sign and validate JWT's. This secret should be a random
// string that is remembered for your application; it's essentially the password to your JWT's.
const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE, REFRESH_TOKEN_LIFE, REFRESH_TOKEN_SECRET } = require('../Config');
const ERRORS = require('../../../client/src/Magic/Errors.magic');
const { R_EMAIL, R_USERNAME } = require('../Magic/Regex.magic');
const { nextTick } = require('process');
/**
 * Constants
 */
const ITERATIONS = 10000;
const HASH_LENGTH = 512;

/**
 * Denote 4me, we never save discovered passwords in the DB, only their hashes
 */
const UserSchema = new mongoose.Schema({
    username: { type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [R_USERNAME, 'is invalid'], index: true },
    email: { type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [R_EMAIL, 'is invalid'], index: true },
    password_hash: String,
    salt: String,
    accessToken: String,
    refreshToken: String,
    oldPasswords: [String]
}, { timestamps: true });

UserSchema.plugin(uniqueValidator, { message: 'is already taken.' });

// Using mongo hooks to save the password as a hash in the DataBase and not as plain text
UserSchema.pre("save", function (next) {
    // Generate salt only when the password_hash has changed (and not when the refreshToken/accessToken has been changed)
    // if the password just now added in the create user so isModified = true
    if (this.password_hash.length < 30) {
        // password_hash was not changed
        this.salt = crypto.randomBytes(16).toString('hex');
        // pbkdf2 algorithm is used to generate and validate hashes 
        this.password_hash = crypto.pbkdf2Sync(this.password_hash, this.salt, ITERATIONS, HASH_LENGTH, 'sha512').toString('hex');

        // Generating the Access & Refresh Tokens right after the user signed up
        this.refreshToken = createToken({ username: this.username, email: this.email }, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_LIFE);
        this.accessToken = createToken({ username: this.username, email: this.email }, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE);
    }
    next()

});

// Methods
/**
 * @param {The given password from the user in order to check if he is authenticated} password 
 * @returns validate passwords - T/F
 */
UserSchema.methods.validatePassword = function (password) {
    var password_hash = crypto.pbkdf2Sync(password, this.salt, ITERATIONS, HASH_LENGTH, 'sha512').toString('hex');
    return this.password_hash === password_hash;
};

UserSchema.methods.validateEmail = function (email) {
    return this.email === email;
};


/**
 * Deleting existed user with its password & username
 */
UserSchema.statics.deleteUserByUsername = async function (username) {
    let userDeleted = await UserModel.findOne({ "username": username });
    if (userDeleted) {
        await userDeleted.delete();
    }
    else {
        throw "User not exist"
    }
}

//Change Password 
UserSchema.statics.changePassword = async function (newPassowrd, email) {
    console.log(newPassowrd, email)
    let userFound = await UserModel.findOne({ email }, (err, user) => {
        if (err) {
            throw err;
        }
        return user;
    });

    if (userFound) {
        await UserModel.updateOne(userFound, { "password_hash": newPassowrd })
        console.log(userFound)
    }
    else {
        throw "User not exist"
    }
}


/**
 * @returns {The user with its new access and refresh tokens}
 */
UserSchema.statics.login = async function (username, password) {
    // If the user did not authenticated then an exception would be thrown
    const userM = await UserModel.authenticate(username, password);
    let payload = { username: userM.username, email: userM.email };
    let accessToken = createToken(payload, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE);
    let refreshToken = createToken(payload, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_LIFE);
    // In order to re-hash the password we need to update the hash to be the plain text just for a moment
    userM.password_hash = password;
    userM.accessToken = accessToken;
    userM.refreshToken = refreshToken;
    await userM.save();
    return userM;
}

/**
 * @returns {User Model in case {username, password} is an authenticated pair, otherwise an exception is thrown}
 * Authenticate the user using its password & username
 */
UserSchema.statics.authenticate = async function (username, password) {
    if (typeof (username) === 'undefined' || typeof (password) === 'undefined') {
        throw "Username and Password must be provided ...";
    }
    // Get User by username
    const user = await UserModel.findOne({ username }, (err, user) => {
        if (err) {
            throw err;
        }
        return user;
    });

    if (user !== null) {
        const userM = new UserModel(user);
        // Check wheter the current given password equals to the password in the DataBase
        if (userM.validatePassword(password)) {
            return userM;
        }
        else {
            throw ERRORS.WRONG_PASSWORD;
        }
    }
    else {
        throw ERRORS.ACCOUNT_NOT_EXIST;
    }
}

UserSchema.statics.refreshAccessToken = async function (accessToken, refreshToken, callBack) {
    if (!accessToken || accessToken == 'undefined' || !refreshToken || refreshToken === 'undefined') {
        throw "No Access/Refresh tokens specified"
    }

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, decode) => {
        if (err && err.toString().includes('TokenExpiredError: jwt expired')) {
            return callBack('Refresh token expired')
        }
        else {
            // The refresh token is verified
            await UserModel.findOne({ email: decode.email }, async (err, user) => {
                if (err) {
                    return callBack('Refresh token forgery')
                }

                user.accessToken = createToken({ username: user.username, email: user.email }, ACCESS_TOKEN_SECRET, 10)
                await user.save()
                return callBack(null, user)
            })
        }
    })
}

// Verify the cookie from browser with the token save in mongodb and
// the access to controlled route will be granted if both matches.
// In case the access token expired, we refresh it
UserSchema.statics.findByTokenOrRefresh = async function (accessToken, refreshToken, callBack) {
    if (!accessToken || typeof (accessToken) === 'undefined') {
        throw "No access token specified :(";
    }
    jwt.verify(accessToken, ACCESS_TOKEN_SECRET, async (err, decode) => {
        if (err && err.toString().includes('TokenExpiredError: jwt expired')) {
            // We need to refresh the access token
            await UserModel.refreshAccessToken(accessToken, refreshToken, async (err, user) => {
                if (err && err.toString() === 'Refresh token expired') {
                    return callBack('Refresh token expired')
                }
                if (err) {
                    return callBack(err);
                }

                return callBack(null, user)
            });
        }
        else {
            if (err) {
                // Another error occured
                return callBack(err);
            }
            await UserModel.findOne({ "username": decode.username, "email": decode.email, "accessToken": accessToken }, (err, user) => {
                if (err) {
                    return callBack(err);
                }
                callBack(null, user);
            })
        }
    })
}

/**
 * @param {new data} newUsername_newPassword_newEmail
 * @param {used to authenticate the user} accessToken 
 */

UserSchema.statics.changeDetails = async function (oldUserDetails, newUsername, newPassword, newEmail) {
    let newRefreshToken = createToken({ username: newUsername, newEmail }, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_LIFE);
    let newAccessToken = createToken({ username: newUsername, newEmail }, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE);
    let salt = crypto.randomBytes(16).toString('hex');
    let updatedUser = await UserModel.findOne({ email: oldUserDetails.email });
    updatedUser.username = newUsername;
    updatedUser.email = newEmail;
    updatedUser.password_hash = newPassword
    updatedUser.refreshToken = newRefreshToken
    updatedUser.accessToken = newAccessToken
    updatedUser.salt = salt
    return updatedUser
    //await updatedUser.save()
}

// Help Functions
// Check if the new email and username are already exist in the DataBase
UserSchema.statics.findDups = async function (oldUsername, newUsername, oldEmail, newEmail) {
    if (oldEmail === newEmail && oldUsername === newUsername) {
        return true;
    }

}

function createToken(payload, secret, expiresIn) {
    return jwt.sign(payload, secret, {
        algorithm: "HS256",
        expiresIn
    })
}

const UserModel = mongoose.model('User', UserSchema);

module.exports = { UserModel, UserSchema };