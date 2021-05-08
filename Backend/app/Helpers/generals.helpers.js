const colors = require("colors");

// 400
function BadRequest(res, err) {
    console.log(`[-] Bad Request: ${err}`.red);
    return res.status(400).send({ error: `Bad Request` })
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

module.exports = {
    BadRequest,
    ServerError,
    Success
}