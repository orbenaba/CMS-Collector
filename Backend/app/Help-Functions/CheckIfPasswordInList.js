const lineReader = require("line-reader");
module.exports = async (sPassword) => {
    let res = false;
    lineReader.eachLine("../Media/password-list.txt", (line) => {
        if (sPassword === line) {
            res = true;
            return true;
        }
    })

    return res;
}

