// Custom modules
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('config');

// Constants
const ACCESS_TOKEN_SECRET = config.get("ACCESS_TOKEN_SECRET");
const REFRESH_TOKEN_SECRET = config.get("REFRESH_TOKEN_SECRET");
const REFRESH_TOKEN_LIFE = config.get("REFRESH_TOKEN_LIFE");
const ACCESS_TOKEN_LIFE = config.get("ACCESS_TOKEN_LIFE");
const ITERATIONS = 10000;
const HASH_LENGTH = 512;
const ERRORS = require('../../../client/src/Magic/Errors.magic');
const { R_EMAIL, R_USERNAME } = require('../Magic/Regex.magic');

// Custom Algorithm
const { IsNotHash, CreateToken, ComparePasswords, IsPasswordAlreadyUsed, AddPasswordToOldPasswords, IsTokenExpired } = require("../Helpers/generals.helpers");

const UserSchema = new mongoose.Schema({
    username: { type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [R_USERNAME, 'is invalid'], index: true },
    email: { type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [R_EMAIL, 'is invalid'], index: true },
    password_hash: String,
    salt: String,
    accessToken: String,
    refreshToken: String,
    oldPasswords: [String]
}, { timestamps: true });

// Usernames/emails cannot be duplicated
UserSchema.plugin(uniqueValidator, { message: 'is already taken.' });

// Using mongo hooks to save the password as a hash in the DataBase and not as plain text

UserSchema.pre("save", function (next) {
    // Generate salt only when the password_hash has changed (and not when the refreshToken/accessToken has been changed)
    if (IsNotHash(this.password_hash)) {
        // This is the function that is always being called when changing a password
        if(IsPasswordAlreadyUsed(this.oldPasswords, this.password_hash)) {
            this.refreshToken = CreateToken({ username: this.username, email: this.email }, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_LIFE);
            this.accessToken = CreateToken({ username: this.username, email: this.email }, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE);        
            throw ERRORS.PASSWORD_USED_RECENTLY;
        }
        else{
            AddPasswordToOldPasswords(this.oldPasswords, this.password_hash);
        }
        this.salt = crypto.randomBytes(16).toString('hex');
        // pbkdf2 algorithm is used to generate and validate hashes 
        this.password_hash = crypto.pbkdf2Sync(this.password_hash, this.salt, ITERATIONS, HASH_LENGTH, 'sha512').toString('hex');
    }
    // Generating the Access & Refresh Tokens right after the user signed up
    this.refreshToken = CreateToken({ username: this.username, email: this.email }, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_LIFE);
    this.accessToken = CreateToken({ username: this.username, email: this.email }, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE);
    next()
});


UserSchema.methods.validatePassword = function (password) {
    return ComparePasswords(this.password_hash, password, this.salt);
};

UserSchema.methods.validateEmail = function (email) {
    return this.email === email;
};

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
    let userFound = await UserModel.findOne({ email }, (err, user) => {
        if (err) {
            console.log(JSON.stringify(err))
            throw err;
        }
        return user;
    });

    if (userFound) {
        try {
            userFound.password_hash = newPassowrd
            const user = hashPassword(userFound)
            console.log(`user found! ${userFound}`)
            // await UserModel.updateOne({ email: userFound.email }, userFound)
            await user.save()
        }
        catch (err) {
            console.log(`err ${JSON.stringify(err)}`)
            throw err
        }
        console.log(`user updated!`)
    }
    else {
        throw new Error("User not exist")
    }
}


UserSchema.statics.login = async function (username, password) {
    // If the user did not authenticated then an exception would be thrown
    const userM = await UserModel.authenticate(username, password);
    let payload = { username: userM.username, email: userM.email };
    let accessToken = CreateToken(payload, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE);
    let refreshToken = CreateToken(payload, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_LIFE);
    // When the user re-login we will refresh its tokens
    userM.accessToken = accessToken;
    userM.refreshToken = refreshToken;
    return userM;
}

/**
 * @returns {User Model in case {username, password} is an authenticated pair, otherwise an exception is thrown}
 * Authenticate the user using its password & username
 */
UserSchema.statics.authenticate = async function (username, password) {
    if (!username || !password) {
        throw "Username and Password must be provided ...";
    }
    // Get User by username
    const user = await UserModel.findOne({ username }, (err, user) => {
        if (err) {
            throw err;
        }
        return user;
    });

    if (user) {
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

UserSchema.statics.refreshAccessToken = async function (accessToken, refreshToken) {
    if (!accessToken || !refreshToken) {
        throw "No Access/Refresh tokens specified"
    }

    try{
        const decode = await jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        const username = decode.username
        const user = await UserModel.findOne({ username });
        user.accessToken = CreateToken({ username: user.username, email: user.email }, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE)
        await user.save()
        return user;       

    }catch(err) {
        if (!IsTokenExpired(err)) {
            throw 'Refresh token expired'
        }
    }
}

// Verify the cookie from browser with the token save in mongodb and
// the access to controlled route will be granted if both matches.
// In case the access token expired, we refresh it
UserSchema.statics.findByTokenOrRefresh = async function (accessToken, refreshToken) {
    if (!accessToken) {
        throw "No access token specified :(";
    }

    try{
        const decode = await jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
        const user = await UserModel.findOne({ username: decode.username })
        return user;
    }catch(err) {
        if (!IsTokenExpired(err)) {
            // We need to refresh the access token
            try{
                const user = await UserModel.refreshAccessToken(accessToken, refreshToken);
                return user;
            }catch(err) {
                if (err && err.toString() === 'Refresh token expired') {
                    throw 'Refresh token expired';
                }
            }
        }
        throw err;
    }
}


/**
 * Changing only sended parameters -> Maybe password will be undefined
 * @param {new data} newUsername_newPassword_newEmail
 * @param {used to authenticate the user} accessToken
 */
UserSchema.statics.changeDetails = async function (updatedUser, newUsername, newPassword, newEmail) {
    updatedUser.username = newUsername ? newUsername : updatedUser.username ;
    updatedUser.email = newEmail ? newEmail : updatedUser.email;
    updatedUser.password_hash = newPassword ? newPassword : updatedUser.password_hash;
    updatedUser.refreshToken = CreateToken({ username: updatedUser.username, email: updatedUser.email }, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_LIFE);
    updatedUser.accessToken = CreateToken({ username: updatedUser.username, email: updatedUser.email }, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE);
    updatedUser.salt = crypto.randomBytes(16).toString('hex');
    return updatedUser
}



function hashPassword(user) {
    // Generate salt only when the password_hash has changed (and not when the refreshToken/accessToken has been changed)
    // if the password just now added in the create user so isModified = true
    if (user.password_hash.length < 30) {
        console.log(`hashing password`);
        // password_hash was not changed
        user.salt = crypto.randomBytes(16).toString('hex');
        // pbkdf2 algorithm is used to generate and validate hashes 
        user.password_hash = crypto.pbkdf2Sync(user.password_hash, user.salt, ITERATIONS, HASH_LENGTH, 'sha512').toString('hex');

        // Generating the Access & Refresh Tokens right after the user signed up
        user.refreshToken = createToken({ username: user.username, email: user.email }, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_LIFE);
        user.accessToken = createToken({ username: user.username, email: user.email }, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE);
    }
    return user
}

const UserModel = mongoose.model('User', UserSchema);

module.exports = { UserModel, UserSchema, CreateToken };

