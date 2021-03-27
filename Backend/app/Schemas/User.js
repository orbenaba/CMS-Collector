const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
// We need a secret to sign and validate JWT's. This secret should be a random
// string that is remembered for your application; it's essentially the password to your JWT's.
const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE, REFRESH_TOKEN_LIFE, REFRESH_TOKEN_SECRET } = require('../Config');

/**
 * Constants
 */
const ITERATIONS = 10000;
const HASH_LENGTH = 512;

/**
 * Denote 4me, we never save discovered passwords in the DB, only their hashes
 */
const UserSchema = new mongoose.Schema({
    username: { type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9_]{5,}[a-zA-Z]+[0-9]*$/, 'is invalid'], index: true },
    email: { type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true },
    password_hash: String,
    salt: String,
    refreshToken: String
}, { timestamps: true });

UserSchema.plugin(uniqueValidator, { message: 'is already taken.' });

// Using mongo hooks to save the password as a hash in the DataBase and not as plain text
UserSchema.pre("save", function () {
    // Generate salt only when the password_hash has changed
    if (this.isModified("password_hash")) {
        this.salt = crypto.randomBytes(16).toString('hex');
        // pbkdf2 algorithm is used to generate and validate hashes 
        this.password_hash = crypto.pbkdf2Sync(this.password_hash, this.salt, ITERATIONS, HASH_LENGTH, 'sha512').toString('hex');

        // Generating the Access Token right after the user signed up
        this.refreshToken = createToken({ username: this.username, email: this.email }, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_LIFE);
    }
});

// Methods
/**
 * @param {The given password from the user in order to check if he is authenticated} password 
 * @returns validate passwords - T/F
 */
UserSchema.methods.validatePassword = function (password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, ITERATIONS, HASH_LENGTH, 'sha512').toString('hex');
    return this.hash === hash;
};

/**
 * Deleting existed user with its password & username
 */
UserSchema.statics.deleteUser = async function (username, password) {
    const userM = await UserModel.authenticate(username, password);
    await userM.delete();
}


UserSchema.statics.login = async function (username, password) {
    // If the user not authenticated then an exception would be thrown
    const userM = await UserModel.authenticate(username, password);
    let payload = { username: userM.username, email: userM.email };
    let accessToken = createToken(payload, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE);
    let refreshToken = createToken(payload, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_LIFE);

    userM.refreshToken = refreshToken;

    await userM.save();
    return accessToken;
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
            throw "Password Not Right ...";
        }
    }
    else {
        throw "User Not Exist ...";
    }
}

// Verify the cookie from browser with the token save in mongodb and
// the access to controlled route will be granted if both matches.
UserSchema.statics.findByToken = async function (refreshToken, callBack) {
    if (!refreshToken || typeof (refreshToken) === 'undefined') {
        throw "Not access token specified :(";
    }
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decode) => {
        if (err) {
            return callBack(err);
        }
        UserModel.findOne({ "username": decode.username, "email": decode.email, "refreshToken": refreshToken }, (err, user) => {
            if (err) {
                return callBack(err);
            }
            callBack(null, user);
        })
    })
}

// Help Function
function createToken(payload, secret, expiresIn) {
    return jwt.sign(payload, secret, {
        algorithm: "HS256",
        expiresIn
    })
}



const UserModel = mongoose.model('User', UserSchema);

module.exports = { UserModel, UserSchema };