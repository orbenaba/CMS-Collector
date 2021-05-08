// Node Modules
const colors = require("colors");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const lineReader = require("line-reader");


const ITERATIONS = 10000;
const HASH_LENGTH = 512;
////////////////////////////////////////////////////////////////////
////////////////////////> SERVER CODES <////////////////////////////
////////////////////////////////////////////////////////////////////
// 400
function BadRequest(res, err) {
    console.log(`[-] Bad Request: ${err}`.red);
    return res.status(400).send({ error: err })
}

function Unauthorized(res, err) {
    console.log(`[-] Unauthorizes: ${err}`.red);
    return res.status(401).send({ error: `Unauthorized` })
}

// 500
function ServerError(res, err) {
    console.log(`[-] Server Error: ${err}`.red);
    return res.status(500).send({ error: "Server Error" });
}

// 200
function Success(res, data) {
    return res.status(200).send(data);
}

////////////////////////////////////////////////////////////////////
/////////////////////////> ONE LINERS </////////////////////////////
////////////////////////////////////////////////////////////////////
function IsNotHash(sPassword) {
    return sPassword.length < 50;
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


module.exports = {
    BadRequest,
    Unauthorized,
    ServerError,
    Success,
    IsNotHash,
    CreateToken,
    ComparePasswords,
    CheckIfPasswordInList,
    RemoveDups
}