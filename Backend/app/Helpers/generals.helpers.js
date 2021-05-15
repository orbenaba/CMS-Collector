// Node Modules
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const lineReader = require("line-reader");
const config = require("config");

const ACCESS_TOKEN = config.get("ACCESS_TOKEN");
const REFRESH_TOKEN = config.get("REFRESH_TOKEN");
const ITERATIONS = 10000;
const HASH_LENGTH = 512;
////////////////////////////////////////////////////////////////////
////////////////////////> SERVER CODES <////////////////////////////
////////////////////////////////////////////////////////////////////
// 400
function BadRequest(res, payload) {
    console.log(`[-] Bad Request: ${payload}`.red);
    return res.status(400).send({ error: payload })
}

async function Unauthorized(res, payload) {
    console.log(`[-] Unauthorized: ${payload}`.red);
    res.locals.unauthorizedWithResponse = true;
    // If the cookies are expired then clear them out
    await ClearAllCookies(res);
    return res.status(401).send({ error: `Unauthorized` })
}

// 500
function ServerError(res, payload) {
    console.log(`[-] Server Error: ${payload}`.red);
    return res.status(500).send({ error: `Server Error: ${payload}` });
}

// 200
function Success(res, payload) {
    return res.status(200).send(payload);
}

async function ClearAllCookies(res) {
    await res.clearCookie(ACCESS_TOKEN);
    await res.clearCookie(REFRESH_TOKEN);
}

////////////////////////////////////////////////////////////////////
/////////////////////////> ONE LINERS </////////////////////////////
////////////////////////////////////////////////////////////////////
function IsNotHash(sPassword) {
    return sPassword.length < 50;
}

function IsTokenExpired(sTokenErr) {
    return !(sTokenErr && sTokenErr.toString().includes('TokenExpiredError: jwt expired'));
}



////////////////////////////////////////////////////////////////////
/////////////////////////> ALGORITHMS </////////////////////////////
////////////////////////////////////////////////////////////////////
function CreateToken(payload, secret, expiresIn) {
    return jwt.sign(payload, secret, {
        algorithm: "HS256",
        expiresIn
    })
}

function ComparePasswords(originalPasswordHash, newPasswordPlain, salt) {
    const newPasswordHash = crypto.pbkdf2Sync(newPasswordPlain, salt, ITERATIONS, HASH_LENGTH, 'sha512').toString('hex');
    return newPasswordHash === originalPasswordHash;
}

async function CheckIfPasswordInList(sPassword) {
    let res = false;
    lineReader.eachLine("../Media/password-list.txt", (line) => {
        if (sPassword === line) {
            res = true;
            return true;
        }
    })
    return res;
}


// By a given array of arrays, we need to return one array which contains 
// one copy of each element in the all array of arrays
function RemoveDups(arrOfArrays) {
    let systems = [];
    // First, create a big array which contain all the elements of arrOfArrays
    for (let i = 0; i < arrOfArrays.length; i++) {
        for (let j = 0; j < arrOfArrays[i].length; j++) {
            systems.push(arrOfArrays[i][j]);
        }
    }
    // Array of name really truck on the dups
    let arrayWithoutDups = [], arrayNamesWithoutDups = [];
    systems.forEach(sys => {
        if (!arrayNamesWithoutDups.includes(sys.name)) {
            arrayWithoutDups.push(sys);
            arrayNamesWithoutDups.push(sys.name);
        }
    })
    return arrayWithoutDups;
}

/**
 * Check if the new user password was already used and if so -> return true
 *       else -> return false
 * @param {At the most the five old passwords} arrOldPasswords 
 * @param {The new password} sNewPassword 
 */
function IsPasswordAlreadyUsed(arrOldPassword, sNewPassword) {
    return Array.isArray(arrOldPassword) && arrOldPassword.find(sOldPassword => sOldPassword === sNewPassword);
}

function AddPasswordToOldPasswords(arrOldPassword, sNewPassword) {
    if (arrOldPassword.length < config.get("OLD_PASSWORDS_MEMORY")) {
        arrOldPassword.push(sNewPassword);
    }
    else {
        // The array is full and we need to remove the oldest password 
        // and add to it the newest one which is always the first
        arrOldPassword = arrOldPassword.shift()
        arrOldPassword.push(sNewPassword)
    }
}


module.exports = {
    BadRequest,
    Unauthorized,
    ServerError,
    Success,
    ClearAllCookies,
    IsNotHash,
    IsTokenExpired,
    CreateToken,
    ComparePasswords,
    CheckIfPasswordInList,
    RemoveDups,
    IsPasswordAlreadyUsed,
    AddPasswordToOldPasswords
}