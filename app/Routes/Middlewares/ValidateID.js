const { BadRequest } = require("../../Helpers/generals.helpers");

module.exports = () => {
    return (req, res, next) => {
        if (!(req.params.id.length >= 22 && req.params.id.length <= 26)) {
            return BadRequest(res, "Invalid ID");
        }
        next();
    }
}